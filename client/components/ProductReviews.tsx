import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp, Edit, Trash2, Plus, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { reviewsApi, queryKeys } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.reviews(productId),
    queryFn: () => reviewsApi.getProductReviews(productId),
  });

  const reviews = data?.reviews || [];
  const stats = data?.stats || {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: [],
  };

  // Create review mutation
  const createMutation = useMutation({
    mutationFn: reviewsApi.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(productId) });
      setIsAddDialogOpen(false);
      setComment("");
      setSelectedRating(5);
      toast({
        title: "✅ تمت إضافة التقييم",
        description: "شكراً لتقييمك! تم إضافة مراجعتك بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في إضافة المراجعة",
        variant: "destructive",
      });
    },
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: ({ id, userId }: { id: string; userId: string }) =>
      reviewsApi.deleteReview(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews(productId) });
      toast({
        title: "تم الحذف",
        description: "تم حذف التقييم بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message || "فشل في حذف المراجعة",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "الرجاء تسجيل الدخول لإضافة تقييم",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      productId,
      userId: user.$id,
      rating: selectedRating,
      comment: comment.trim() || undefined,
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    if (!user) return;
    if (confirm("هل أنت متأكد من حذف التقييم؟")) {
      deleteMutation.mutate({ id: reviewId, userId: user.$id });
    }
  };

  // Check if user has already reviewed
  const userReview = reviews.find((r: any) => user && r.userEmail === user.email);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">جاري تحميل التقييمات...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardHeader>
          <CardTitle>تقييمات المنتج</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 ${star <= Math.round(stats.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted"
                      }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                بناءً على {stats.totalReviews} تقييم
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {stats.ratingDistribution.map((dist: any) => (
                <div key={dist.stars} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{dist.stars}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <Progress value={dist.percentage} className="flex-1" />
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Add Review Button */}
          {user && !userReview && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="w-full">
              <Plus className="h-4 w-4 ml-2 rtl:ml-0 rtl:mr-2" />
              أضف تقييمك
            </Button>
          )}

          {!user && (
            <p className="text-center text-sm text-muted-foreground">
              يجب تسجيل الدخول لإضافة تقييم
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Star className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">لا توجد تقييمات بعد</h3>
                <p className="text-muted-foreground">كن أول من يشارك رأيه حول هذا المنتج</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review: any) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUser={user}
              onDelete={handleDeleteReview}
              isDeleting={deleteMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Add Review Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>أضف تقييمك</DialogTitle>
            <DialogDescription>
              شاركنا رأيك حول هذا المنتج
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                التقييم
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 cursor-pointer transition-colors ${star <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted hover:text-yellow-200"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                التعليق (اختياري)
              </label>
              <Textarea
                placeholder="اكتب تعليقك هنا..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={createMutation.isPending}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleSubmitReview}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "جاري الإضافة..." : "إضافة التقييم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReviewCard({ review, currentUser, onDelete, isDeleting }: {
  review: any;
  currentUser: any;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();

  const handleHelpful = async () => {
    if (!currentUser) {
      toast({
        title: "يجب تسجيل الدخول",
        description: "يرجى تسجيل الدخول للتفاعل مع التقييمات",
        variant: "destructive",
      });
      return;
    }

    if (hasVoted) return;

    try {
      await reviewsApi.markReviewHelpful(review.id);
      setHelpfulCount((prev: number) => prev + 1);
      setHasVoted(true);
      toast({
        title: "شكراً لك",
        description: "تم تسجيل صوتك بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل صوتك",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-primary/10 to-purple-500/10 text-primary font-bold">
                {review.userName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-base">{review.userName}</p>
                {review.verified && (
                  <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <BadgeCheck className="w-3 h-3" />
                    شراء مؤكد
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3.5 w-3.5 ${star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-200"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.$createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Delete button for own reviews */}
          {currentUser && review.userEmail === currentUser.email && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-2 -ml-2"
              onClick={() => onDelete(review.id)}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {review.comment && (
          <p className="text-foreground/90 leading-relaxed mb-4 text-sm md:text-base bg-muted/30 p-3 rounded-lg">
            {review.comment}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 text-muted-foreground hover:text-primary ${hasVoted ? 'text-primary bg-primary/5' : ''}`}
            onClick={handleHelpful}
            disabled={hasVoted}
          >
            <ThumbsUp className={`h-4 w-4 ${hasVoted ? 'fill-current' : ''}`} />
            <span>مفيد ({helpfulCount})</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
