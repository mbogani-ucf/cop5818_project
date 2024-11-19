from http.client import NOT_FOUND
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post, Comment, DiscussionThread, Vote
from .serializers import PostSerializer, CommentSerializer, DiscussionThreadSerializer, VoteSerializer
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.authentication import JWTAuthentication
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status  
import requests
from django.http import JsonResponse
from django.views import View


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only the owner of a post to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow all users to view (GET, HEAD, OPTIONS) the post
        if request.method in permissions.SAFE_METHODS:
            return True
        # Allow only the post author to edit or delete their own post
        return obj.author == request.user
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        # Automatically assign the current user as the author
        serializer.save(author=self.request.user)
    
    def perform_update(self, serializer):
        # Check if the user is the author before updating
        instance = self.get_object()
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to edit this post.")
        serializer.save()

    def perform_destroy(self, instance):
        # Ensure only the author can delete their post
        if instance.author != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to delete this post.")
        instance.delete()

    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        """
        Custom action to get all comments for a particular post.
        """
        post = self.get_object()  # This gets the specific post object
        comments = post.comments.all()  # Access the related comments
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Create the comment with the user and the associated post
        serializer.save(author=self.request.user)

    def get_queryset(self):
        # Filter comments by post_id from query parameters if available
        post_id = self.request.query_params.get('post_id')
        if post_id:
            return Comment.objects.filter(post_id=post_id)
        return JsonResponse({"message": "No comments available"})



# Discussion Thread viewset
class DiscussionThreadViewSet(viewsets.ModelViewSet):
    queryset = DiscussionThread.objects.all()
    serializer_class = DiscussionThreadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user.userprofile)

    def update(self, request, *args, **kwargs):
        thread = self.get_object()
        if thread.author != request.user.userprofile:
            return Response({"error": "You can only edit your own discussion thread."}, status=403)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        thread = self.get_object()
        if thread.author != request.user.userprofile:
            return Response({"error": "You can only delete your own discussion thread."}, status=403)
        return super().destroy(request, *args, **kwargs)

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='upvote')
    def upvote(self, request):
        post_id = request.data.get('post_id')
        user = request.user

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=404)

        # Check for an existing vote
        existing_vote = Vote.objects.filter(post=post, user=user).first()
        if existing_vote:
            return Response({"detail": "You have already upvoted this post."}, status=400)

        # Create the upvote
        vote = Vote.objects.create(user=user, post=post)
        return Response(VoteSerializer(vote).data, status=201)

    @action(detail=False, methods=['delete'], url_path='downvote')
    def downvote(self, request):
        post_id = request.data.get('post_id')
        user = request.user

        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=404)

        # Check for an existing vote
        existing_vote = Vote.objects.filter(post=post, user=user).first()
        if not existing_vote:
            return Response({"detail": "No vote found to remove."}, status=400)

        # Remove the vote
        existing_vote.delete()
        return Response({"detail": "Downvote removed."}, status=200)
# Stock Price API View
class StockPriceView(View):
    def get(self, request):
        url = "https://www.alphavantage.co/query"
        api_key = "RP39HDJ4A4AFGJM2"
        symbols = ['AAPL', 'GOOG', 'MSFT', 'TSLA']  # Example stock symbols

        stock_data = {}
        rate_limit_exceeded = False
        rate_limit_message = ""

        for symbol in symbols:
            params = {
                "function": "TIME_SERIES_INTRADAY",
                "symbol": symbol,
                "interval": "5min",
                "apikey": api_key
            }
            response = requests.get(url, params=params)
            data = response.json()

            # Check if the rate limit message is in the response
            if "Information" in data:
                rate_limit_message = data["Information"]
                rate_limit_exceeded = True
                break

            # If data is valid, extract price and timestamp
            try:
                price = float(data['Time Series (5min)'][list(data['Time Series (5min)'].keys())[0]]['1. open'])
                updated_at = list(data['Time Series (5min)'].keys())[0]
                stock_data[symbol] = {
                    "price": price,
                    "updated_at": updated_at
                }
            except KeyError:
                continue

        if rate_limit_exceeded:
            return JsonResponse({"message": rate_limit_message})

        return JsonResponse(stock_data)
