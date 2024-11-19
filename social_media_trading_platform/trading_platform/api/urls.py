from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PostViewSet,
    CommentViewSet,
    DiscussionThreadViewSet,
    VoteViewSet,
    StockPriceView
)

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'discussion-threads', DiscussionThreadViewSet, basename='discussion-thread')
router.register(r'votes', VoteViewSet, basename='vote')

urlpatterns = [
    path('', include(router.urls)),

    # Endpoint for Stock Prices
    path('stock-prices/', StockPriceView.as_view(), name='stock-prices'),

    # Nested routes for Votes under Discussion Threads
    path('discussion-threads/<int:thread_pk>/votes/', VoteViewSet.as_view({'get': 'list', 'post': 'create'}), name='thread-votes'),
    path('discussion-threads/<int:thread_pk>/votes/<int:pk>/', VoteViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='vote-detail'),
]
