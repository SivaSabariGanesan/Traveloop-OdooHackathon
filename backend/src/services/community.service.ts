import { communityRepo } from '../repositories/community.repo';
import { AppError } from '../utils/AppError';

export const communityService = {
  getPosts: async (page = 1, limit = 10) => {
    const [posts, total] = await Promise.all([
      communityRepo.findAll(page, limit),
      communityRepo.count(),
    ]);
    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  create: (userId: string, data: any) => communityRepo.create(userId, data),

  like: async (postId: string) => {
    const post = await communityRepo.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    return communityRepo.incrementLikes(postId);
  },

  delete: async (userId: string, postId: string) => {
    const post = await communityRepo.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.userId !== userId) throw new AppError('Forbidden', 403);
    return communityRepo.delete(postId);
  },
};
