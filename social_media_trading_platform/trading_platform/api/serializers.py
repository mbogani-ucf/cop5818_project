from rest_framework import serializers
from .models import Post, Comment, DiscussionThread, Vote

# Serializer for Post
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'created_at', 'updated_at']

# Serializer for Comment

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author_username', 'content', 'created_at', 'updated_at']
        read_only_fields = ['author_username', 'created_at', 'updated_at']
        
# Serializer for DiscussionThread
class DiscussionThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionThread
        fields = ['id', 'author', 'title', 'content', 'created_at', 'updated_at']

# Serializer for Vote
class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ['id', 'user', 'post']

