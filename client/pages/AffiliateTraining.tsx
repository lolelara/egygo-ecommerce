import { useState } from 'react';
import { BookOpen, Video, FileText, Award, Download, Play, CheckCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const courses = [
  {
    id: 1,
    title: 'أساسيات التسويق بالعمولة',
    description: 'تعلم الأساسيات من الصفر',
    duration: '2 ساعة',
    lessons: 12,
    level: 'مبتدئ',
    completed: 8,
    locked: false,
    icon: BookOpen
  },
  {
    id: 2,
    title: 'استراتيجيات التسويق المتقدمة',
    description: 'تقنيات احترافية لزيادة المبيعات',
    duration: '3 ساعات',
    lessons: 15,
    level: 'متقدم',
    completed: 0,
    locked: false,
    icon: Video
  },
  {
    id: 3,
    title: 'التسويق عبر وسائل التواصل',
    description: 'كيف تسوق بفعالية على السوشيال ميديا',
    duration: '2.5 ساعة',
    lessons: 10,
    level: 'متوسط',
    completed: 0,
    locked: false,
    icon: FileText
  }
];

const videos = [
  {
    id: 1,
    title: 'كيف تبدأ التسويق بالعمولة',
    duration: '15:30',
    views: 1250,
    thumbnail: 'https://via.placeholder.com/300x200',
    completed: true
  },
  {
    id: 2,
    title: 'أفضل الممارسات للمسوقين',
    duration: '22:45',
    views: 980,
    thumbnail: 'https://via.placeholder.com/300x200',
    completed: false
  },
  {
    id: 3,
    title: 'كيف تزيد عمولاتك 3 أضعاف',
    duration: '18:20',
    views: 2100,
    thumbnail: 'https://via.placeholder.com/300x200',
    completed: false
  }
];

const guides = [
  {
    id: 1,
    title: 'دليل المسوق الناجح',
    pages: 45,
    downloads: 5200,
    format: 'PDF'
  },
  {
    id: 2,
    title: 'استراتيجيات التسويق الفعال',
    pages: 32,
    downloads: 3800,
    format: 'PDF'
  },
  {
    id: 3,
    title: 'قوالب المحتوى الجاهزة',
    pages: 20,
    downloads: 4500,
    format: 'PDF'
  }
];

export default function AffiliateTraining() {
  const [activeTab, setActiveTab] = useState('courses');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">أكاديمية التسويق</h1>
          <p className="text-muted-foreground">تعلم وطور مهاراتك في التسويق بالعمولة</p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <Award className="h-4 w-4 ml-1" />
          مسوق محترف
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-white/80 text-sm">الدورات المكتملة</p>
              <p className="text-3xl font-bold">1/3</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">الدروس المكتملة</p>
              <p className="text-3xl font-bold">8/37</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">إجمالي التقدم</p>
              <p className="text-3xl font-bold">22%</p>
            </div>
          </div>
          <Progress value={22} className="mt-4 h-2 bg-white/20" />
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">
            <BookOpen className="h-4 w-4 ml-2" />
            الدورات
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 ml-2" />
            الفيديوهات
          </TabsTrigger>
          <TabsTrigger value="guides">
            <FileText className="h-4 w-4 ml-2" />
            الأدلة
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-4">
          {courses.map((course) => {
            const Icon = course.icon;
            const progress = (course.completed / course.lessons) * 100;

            return (
              <Card key={course.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                        </div>
                        {course.locked ? (
                          <Badge variant="secondary">
                            <Lock className="h-3 w-3 ml-1" />
                            مقفل
                          </Badge>
                        ) : (
                          <Badge>{course.level}</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{course.lessons} درس</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                        <span>•</span>
                        <span>{course.completed}/{course.lessons} مكتمل</span>
                      </div>

                      <div className="space-y-2">
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{Math.round(progress)}% مكتمل</span>
                          <Button size="sm" disabled={course.locked}>
                            {course.completed > 0 ? 'متابعة' : 'ابدأ الآن'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Button size="lg" className="rounded-full">
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70">
                    {video.duration}
                  </Badge>
                  {video.completed && (
                    <Badge className="absolute top-2 left-2 bg-green-500">
                      <CheckCircle className="h-3 w-3 ml-1" />
                      مكتمل
                    </Badge>
                  )}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.views.toLocaleString()} مشاهدة</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-4">
          {guides.map((guide) => (
            <Card key={guide.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{guide.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{guide.pages} صفحة</span>
                        <span>•</span>
                        <span>{guide.format}</span>
                        <span>•</span>
                        <span>{guide.downloads.toLocaleString()} تحميل</span>
                      </div>
                    </div>
                  </div>
                  <Button>
                    <Download className="h-4 w-4 ml-2" />
                    تحميل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Certification */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">احصل على شهادة معتمدة</h3>
              <p className="text-sm text-muted-foreground">
                أكمل جميع الدورات واحصل على شهادة مسوق محترف معتمدة
              </p>
            </div>
            <Button variant="outline" className="border-yellow-600 text-yellow-600">
              المزيد
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
