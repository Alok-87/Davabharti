
// blog.ts
export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    status: 'draft' | 'published';
    author: string;
    createdAt: string;
    updatedAt: string;
}

export interface BlogListResponse {
    blogs: Blog[];
    total_count: number;
}
