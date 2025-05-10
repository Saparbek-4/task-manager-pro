// src/types.ts
export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
}

export interface CreateProjectDto {
    name: string;
    description?: string;
}