
import { databases, appwriteConfig, ID } from "./appwrite";
import { Permission, Role, Query } from "appwrite";

// Types
export interface Page {
    $id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
    $createdAt: string;
    $updatedAt: string;
}

export interface Notification {
    $id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    targetUser?: string;
    isRead: boolean;
    link?: string;
    $createdAt: string;
}

export interface PageCreate {
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
}

export interface NotificationCreate {
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    targetUser?: string;
    link?: string;
}

// CMS Pages API
export const cmsApi = {
    getAllPages: async () => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                "pages",
                [Query.orderDesc("$createdAt")]
            );
            return response.documents as unknown as Page[];
        } catch (error) {
            console.error("Error fetching pages:", error);
            return [];
        }
    },

    getPageBySlug: async (slug: string) => {
        try {
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                "pages",
                [Query.equal("slug", slug), Query.limit(1)]
            );
            if (response.documents.length === 0) return null;
            return response.documents[0] as unknown as Page;
        } catch (error) {
            console.error("Error fetching page by slug:", error);
            return null;
        }
    },

    getPageById: async (id: string) => {
        try {
            const response = await databases.getDocument(
                appwriteConfig.databaseId,
                "pages",
                id
            );
            return response as unknown as Page;
        } catch (error) {
            console.error("Error fetching page by id:", error);
            throw error;
        }
    },

    createPage: async (data: PageCreate) => {
        try {
            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                "pages",
                ID.unique(),
                data
            );
            return response as unknown as Page;
        } catch (error) {
            console.error("Error creating page:", error);
            throw error;
        }
    },

    updatePage: async (id: string, data: Partial<PageCreate>) => {
        try {
            const response = await databases.updateDocument(
                appwriteConfig.databaseId,
                "pages",
                id,
                data
            );
            return response as unknown as Page;
        } catch (error) {
            console.error("Error updating page:", error);
            throw error;
        }
    },

    deletePage: async (id: string) => {
        try {
            await databases.deleteDocument(appwriteConfig.databaseId, "pages", id);
            return true;
        } catch (error) {
            console.error("Error deleting page:", error);
            throw error;
        }
    },
};

// Notifications API
export const notificationsApi = {
    getAllNotifications: async () => {
        try {
            // In a real app, you might filter by current user or show all for admin
            const response = await databases.listDocuments(
                appwriteConfig.databaseId,
                "notifications",
                [Query.orderDesc("$createdAt"), Query.limit(50)]
            );
            return response.documents as unknown as Notification[];
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return [];
        }
    },

    sendNotification: async (data: NotificationCreate) => {
        try {
            const response = await databases.createDocument(
                appwriteConfig.databaseId,
                "notifications",
                ID.unique(),
                {
                    ...data,
                    isRead: false,
                }
            );
            return response as unknown as Notification;
        } catch (error) {
            console.error("Error sending notification:", error);
            throw error;
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await databases.deleteDocument(
                appwriteConfig.databaseId,
                "notifications",
                id
            );
            return true;
        } catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    },
};
