11. COURSE PLAYER & LEARNING EXPERIENCE
11.1 Course Detail Page
typescript// app/(tenant)/courses/[slug]/page.tsx

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await fetchCourse(params.slug);
  const { user } = await getCurrentUser();
  
  // Check if user is enrolled
  const isEnrolled = await checkEnrollment(course.id, user?.id);
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Course Hero Section */}
      <CourseHero 
        course={course} 
        isEnrolled={isEnrolled}
      />
      
      {/* Course Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">What You'll Learn</h2>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.learning_outcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          {/* Course Description */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">About This Course</h2>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: course.description }}
              />
            </CardContent>
          </Card>
          
          {/* Course Curriculum */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Course Curriculum</h2>
            </CardHeader>
            <CardContent>
              <CourseCurriculum 
                course={course} 
                isEnrolled={isEnrolled}
              />
            </CardContent>
          </Card>
          
          {/* Instructor Info */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Your Instructor</h2>
            </CardHeader>
            <CardContent>
              <InstructorProfile instructor={course.instructor} />
            </CardContent>
          </Card>
          
          {/* Student Reviews */}
          {course.reviews_count > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Student Reviews</h2>
              </CardHeader>
              <CardContent>
                <CourseReviews courseId={course.id} />
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Enrollment Card */}
            <EnrollmentCard 
              course={course} 
              isEnrolled={isEnrolled}
            />
            
            {/* Course Info */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Course Info</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <ClockIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{course.duration_hours} hours</span>
                </div>
                <div className="flex items-center">
                  <BookOpenIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{course.lessons_count} lessons</span>
                </div>
                <div className="flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span>{course.enrolled_students_count} students</span>
                </div>
                <div className="flex items-center">
                  <BarChartIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="capitalize">{course.level}</span>
                </div>
                <div className="flex items-center">
                  <GlobeIcon className="w-5 h-5 mr-2 text-gray-500" />
                  <span className="capitalize">{course.language}</span>
                </div>
                {course.is_certificate_enabled && (
                  <div className="flex items-center">
                    <AwardIcon className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Certificate of completion</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
11.2 Course Hero Component
typescript// components/courses/CourseHero.tsx

'use client';

interface CourseHeroProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseHero({ course, isEnrolled }: CourseHeroProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <Image
          src={course.thumbnail_url}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="relative p-8 md:p-12">
        <div className="max-w-3xl">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-4">
            <Link href="/courses" className="hover:underline">
              Courses
            </Link>
            <ChevronRightIcon className="w-4 h-4" />
            <span>{course.category?.name}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {course.title}
          </h1>
          
          {/* Short Description */}
          <p className="text-xl mb-6 opacity-90">
            {course.short_description}
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Rating */}
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(course.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-semibold">
                {course.rating.toFixed(1)}
              </span>
              <span className="ml-1 opacity-75">
                ({course.reviews_count} reviews)
              </span>
            </div>
            
            {/* Students Enrolled */}
            <div className="flex items-center">
              <UsersIcon className="w-5 h-5 mr-2" />
              <span>{course.enrolled_students_count.toLocaleString()} students</span>
            </div>
            
            {/* Last Updated */}
            <div className="flex items-center">
              <CalendarIcon className="w-5 h-5 mr-2" />
              <span>Updated {formatDate(course.updated_at)}</span>
            </div>
          </div>
          
          {/* Instructor */}
          <div className="flex items-center mt-6">
            <Avatar src={course.instructor.profile_photo_url} size="md" />
            <div className="ml-3">
              <p className="text-sm opacity-75">Created by</p>
              <p className="font-semibold">{course.instructor.name}</p>
            </div>
          </div>
          
          {/* Enrollment Status Badge */}
          {isEnrolled && (
            <div className="mt-6">
              <Badge variant="success" size="lg">
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                You're enrolled in this course
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
11.3 Course Curriculum Component
typescript// components/courses/CourseCurriculum.tsx

'use client';

interface CourseCurriculumProps {
  course: Course;
  isEnrolled: boolean;
}

export function CourseCurriculum({ course, isEnrolled }: CourseCurriculumProps) {
  const { data: curriculum } = useQuery({
    queryKey: ['courseCurriculum', course.id],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/courses/${course.id}/structure`);
      return response.data.data;
    }
  });
  
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  
  const toggleSection = (sectionId: number) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };
  
  if (!curriculum) return <Skeleton count={5} />;
  
  return (
    <div className="space-y-2">
      {curriculum.map((section) => (
        <div key={section.id} className="border rounded-lg">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center flex-1">
              <ChevronDownIcon
                className={`w-5 h-5 mr-3 transition-transform ${
                  expandedSections.includes(section.id) ? 'rotate-180' : ''
                }`}
              />
              <div className="text-left">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-gray-500">
                  {section.lessons_count} lessons · {section.duration_minutes} min
                </p>
              </div>
            </div>
            
            {section.is_locked && !isEnrolled && (
              <LockIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {/* Section Content (Lessons) */}
          {expandedSections.includes(section.id) && (
            <div className="border-t">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="flex items-center flex-1">
                    {/* Lesson Icon */}
                    {getLessonIcon(lesson.content_type)}
                    
                    <div className="ml-3">
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-500">
                        {lesson.duration_minutes} min
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Preview Badge */}
                    {lesson.is_preview && (
                      <Badge variant="outline">Preview</Badge>
                    )}
                    
                    {/* Play/Lock Icon */}
                    {lesson.is_preview || isEnrolled ? (
                      <Link href={`/courses/${course.slug}/lessons/${lesson.id}`}>
                        <Button variant="ghost" size="sm">
                          <PlayIcon className="w-4 h-4" />
                        </Button>
                      </Link>
                    ) : (
                      <LockIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getLessonIcon(contentType: string) {
  const icons = {
    video: <PlayCircleIcon className="w-5 h-5 text-blue-500" />,
    document: <FileTextIcon className="w-5 h-5 text-purple-500" />,
    text: <AlignLeftIcon className="w-5 h-5 text-gray-500" />,
    quiz: <HelpCircleIcon className="w-5 h-5 text-green-500" />,
    assignment: <FileIcon className="w-5 h-5 text-orange-500" />
  };
  
  return icons[contentType] || <FileIcon className="w-5 h-5 text-gray-500" />;
}
11.4 Enrollment Card
typescript// components/courses/EnrollmentCard.tsx

'use client';

interface EnrollmentCardProps {
  course: Course;
  isEnrolled: boolean;
}

export function EnrollmentCard({ course, isEnrolled }: EnrollmentCardProps) {
  const router = useRouter();
  const { mutate: enrollCourse, isLoading } = useEnrollCourse();
  
  const handleEnroll = () => {
    if (course.price && course.price > 0) {
      // Redirect to payment
      router.push(`/courses/${course.slug}/checkout`);
    } else {
      // Free enrollment
      enrollCourse(course.id, {
        onSuccess: () => {
          toast.success('Successfully enrolled!');
          router.push(`/courses/${course.slug}/lessons/${course.first_lesson_id}`);
        }
      });
    }
  };
  
  const handleContinue = () => {
    router.push(`/courses/${course.slug}/lessons/${course.last_accessed_lesson_id}`);
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        {/* Price */}
        {course.price && course.price > 0 ? (
          <div className="mb-4">
            <div className="text-3xl font-bold">
              {course.currency} {course.price.toLocaleString()}
            </div>
            {course.original_price && (
              <div className="text-gray-500 line-through">
                {course.currency} {course.original_price.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <Badge variant="success" size="lg">Free Course</Badge>
          </div>
        )}
        
        {/* Action Button */}
        {isEnrolled ? (
          <div className="space-y-3">
            <Button 
              onClick={handleContinue}
              className="w-full"
              size="lg"
            >
              Continue Learning
            </Button>
            
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Your Progress</span>
                <span className="font-semibold">
                  {course.user_progress}%
                </span>
              </div>
              <Progress value={course.user_progress} />
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleEnroll}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : course.price && course.price > 0 ? (
              'Buy Now'
            ) : (
              'Enroll for Free'
            )}
          </Button>
        )}
        
        {/* Money-back guarantee */}
        {course.price && course.price > 0 && (
          <p className="text-sm text-center text-gray-500 mt-3">
            30-day money-back guarantee
          </p>
        )}
        
        {/* Share */}
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-semibold mb-2">Share this course</p>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Share2Icon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <TwitterIcon className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <FacebookIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
11.5 Lesson Player Layout
typescript// app/(tenant)/courses/[slug]/lessons/[id]/page.tsx

export default async function LessonPlayerPage({ 
  params 
}: { 
  params: { slug: string; id: string } 
}) {
  const [course, lesson] = await Promise.all([
    fetchCourse(params.slug),
    fetchLesson(params.id)
  ]);
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <LessonPlayerHeader course={course} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col bg-black">
          <LessonContent lesson={lesson} />
          
          {/* Content Tabs (below video) */}
          <div className="bg-white flex-shrink-0">
            <LessonTabs lesson={lesson} course={course} />
          </div>
        </div>
        
        {/* Sidebar (Curriculum) */}
        <div className="w-96 bg-white border-l overflow-y-auto">
          <LessonSidebar course={course} currentLessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}
11.6 Lesson Player Header
typescript// components/courses/LessonPlayerHeader.tsx

'use client';

interface LessonPlayerHeaderProps {
  course: Course;
}

export function LessonPlayerHeader({ course }: LessonPlayerHeaderProps) {
  const router = useRouter();
  
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/courses/${course.slug}`)}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Course
        </Button>
        
        {/* Course Title */}
        <div className="border-l pl-4">
          <h1 className="font-semibold text-lg">{course.title}</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Progress */}
        <div className="flex items-center space-x-2">
          <Progress value={course.user_progress} className="w-32" />
          <span className="text-sm font-medium">
            {course.user_progress}% Complete
          </span>
        </div>
        
        {/* Notes */}
        <Button variant="outline" size="sm">
          <FileTextIcon className="w-4 h-4 mr-2" />
          Notes
        </Button>
        
        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Bookmark
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2Icon className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FlagIcon className="w-4 h-4 mr-2" />
              Report Issue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
11.7 Lesson Sidebar
typescript// components/courses/LessonSidebar.tsx

'use client';

interface LessonSidebarProps {
  course: Course;
  currentLessonId: number;
}

export function LessonSidebar({ course, currentLessonId }: LessonSidebarProps) {
  const { data: curriculum } = useQuery({
    queryKey: ['courseCurriculum', course.id],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/courses/${course.id}/structure`);
      return response.data.data;
    }
  });
  
  const { data: progress } = useQuery({
    queryKey: ['courseProgress', course.id],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/courses/${course.id}/progress`);
      return response.data.data;
    }
  });
  
  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Course Content</h2>
      
      <div className="space-y-2">
        {curriculum?.map((section) => (
          <div key={section.id}>
            <div className="font-semibold text-sm text-gray-700 mb-2">
              {section.title}
            </div>
            
            {section.lessons.map((lesson) => {
              const isCompleted = progress?.completed_lessons?.includes(lesson.id);
              const isCurrent = lesson.id === currentLessonId;
              
              return (
                <Link
                  key={lesson.id}
                  href={`/courses/${course.slug}/lessons/${lesson.id}`}
                  className={`block p-3 rounded-lg hover:bg-gray-100 transition-colors ${
                    isCurrent ? 'bg-blue-50 border-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start">
                    {/* Completion Checkbox */}
                    <div className="mt-0.5 mr-3">
                      {isCompleted ? (
                        <CheckCircle2Icon className="w-5 h-5 text-green-500" />
                      ) : (
                        <CircleIcon className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isCurrent ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {lesson.title}
                      </p>
                      
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        {getLessonTypeIcon(lesson.content_type)}
                        <span className="ml-1">{lesson.duration_minutes} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

12. VIDEO PLAYER IMPLEMENTATION
12.1 Video.js Integration
typescript// components/courses/VideoPlayer.tsx

'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  lesson: Lesson;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
}

export function VideoPlayer({ lesson, onProgress, onComplete }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: videoUrls } = useQuery({
    queryKey: ['videoUrls', lesson.video_id],
    queryFn: async () => {
      const response = await apiClient.get(`/v1/videos/${lesson.video_id}/url`);
      return response.data;
    },
    enabled: !!lesson.video_id
  });
  
  useEffect(() => {
    if (!videoRef.current || !videoUrls) return;
    
    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: true,
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      controlBar: {
        children: [
          'playToggle',
          'volumePanel',
          'currentTimeDisplay',
          'timeDivider',
          'durationDisplay',
          'progressControl',
          'remainingTimeDisplay',
          'playbackRateMenuButton',
          'qualitySelector', // Custom plugin
          'fullscreenToggle'
        ]
      },
      sources: [
        {
          src: videoUrls.url_720p,
          type: 'video/mp4',
          label: '720p',
          selected: true
        },
        {
          src: videoUrls.url_360p,
          type: 'video/mp4',
          label: '360p'
        }
      ]
    });
    
    playerRef.current = player;
    
    // Event Listeners
    player.on('loadeddata', () => {
      setIsLoading(false);
      
      // Resume from last position
      const savedTime = localStorage.getItem(`video_${lesson.id}_time`);
      if (savedTime) {
        player.currentTime(parseFloat(savedTime));
      }
    });
    
    player.on('timeupdate', () => {
      const currentTime = player.currentTime();
      const duration = player.duration();
      
      // Save progress every 5 seconds
      if (Math.floor(currentTime) % 5 === 0) {
        localStorage.setItem(`video_${lesson.id}_time`, currentTime.toString());
        onProgress?.(currentTime, duration);
      }
      
      // Mark as complete at 90%
      if (currentTime / duration >= 0.9) {
        onComplete?.();
      }
    });
    
    player.on('ended', () => {
      onComplete?.();
    });
    
    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoUrls, lesson.id]);
  
  return (
    <div className="relative bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}
      
      <video
        ref={videoRef}
        className="video-js vjs-big-play-centered"
        playsInline
      />
      
      {/* Keyboard Shortcuts Overlay */}
      <VideoKeyboardShortcuts />
    </div>
  );
}
12.2 Video Progress Tracking
typescript// lib/hooks/useVideoProgress.ts

export function useVideoProgress(lessonId: number) {
  const { mutate: updateProgress } = useMutation({
    mutationFn: async (data: { currentTime: number; duration: number }) => {
      await apiClient.post(`/v1/lessons/${lessonId}/progress`, {
        time_spent_seconds: data.currentTime,
        video_progress_seconds: data.currentTime
      });
    }
  });
  
  const { mutate: markComplete } = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/v1/lessons/${lessonId}/complete`);
    },
    onSuccess: () => {
      toast.success('Lesson marked as complete!');
      // Invalidate course progress
      queryClient.invalidateQueries(['courseProgress']);
    }
  });
  
  // Debounced progress update (every 10 seconds)
  const debouncedUpdate = useMemo(
    () =>
      debounce((currentTime: number, duration: number) => {
        updateProgress({ currentTime, duration });
      }, 10000),
    [updateProgress]
  );
  
  return {
    updateProgress: debouncedUpdate,
    markComplete
  };
}

// Usage in VideoPlayer
function VideoPlayer({ lesson }: VideoPlayerProps) {
  const { updateProgress, markComplete } = useVideoProgress(lesson.id);
  
  return (
    <VideoPlayer
      lesson={lesson}
      onProgress={updateProgress}
      onComplete={markComplete}
    />
  );
}
12.3 Video Quality Selector
typescript// lib/videojs-plugins/qualitySelector.ts

import videojs from 'video.js';

const MenuItem = videojs.getComponent('MenuItem');
const MenuButton = videojs.getComponent('MenuButton');

class QualityMenuItem extends MenuItem {
  constructor(player: any, options: any) {
    super(player, options);
    this.label = options.label;
    this.src = options.src;
  }
  
  handleClick() {
    const player = this.player();
    const currentTime = player.currentTime();
    const isPaused = player.paused();
    
    // Change source
    player.src({ src: this.src, type: 'video/mp4' });
    
    // Restore playback position
    player.one('loadeddata', () => {
      player.currentTime(currentTime);
      if (!isPaused) {
        player.play();
      }
    });
    
    // Update selected state
    this.addClass('vjs-selected');
    const siblings = this.el().parentElement?.querySelectorAll('.vjs-menu-item');
    siblings?.forEach(sibling => {
      if (sibling !== this.el()) {
        sibling.classList.remove('vjs-selected');
      }
    });
  }
}

class QualitySelector extends MenuButton {
  constructor(player: any, options: any) {
    super(player, options);
    this.controlText('Quality');
  }
  
  createItems() {
    const player = this.player();
    const sources = player.options_.sources || [];
    
    return sources.map((source: any) => {
      return new QualityMenuItem(player, {
        label: source.label,
        src: source.src,
        selected: source.selected
      });
    });
  }
}

// Register component
videojs.registerComponent('qualitySelector', QualitySelector);
12.4 Keyboard Shortcuts
typescript// components/courses/VideoKeyboardShortcuts.tsx

export function VideoKeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);
  
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Show/hide help
      if (e.key === '?' || e.key === 'h') {
        setShowHelp(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);
  
  if (!showHelp) return null;
  
  return (
    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <ShortcutRow shortcut="Space / K" description="Play/Pause" />
            <ShortcutRow shortcut="←" description="Rewind 5 seconds" />
            <ShortcutRow shortcut="→" description="Forward 5 seconds" />
            <ShortcutRow shortcut="↑" description="Volume up" />
            <ShortcutRow shortcut="↓" description="Volume down" />
            <ShortcutRow shortcut="M" description="Mute/Unmute" />
            <ShortcutRow shortcut="F" description="Fullscreen" />
            <ShortcutRow shortcut="0-9" description="Jump to 0%-90%" />
            <ShortcutRow shortcut="< >" description="Decrease/Increase speed" />
            <ShortcutRow shortcut="?" description="Show this help" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShortcutRow({ shortcut, description }: { shortcut: string; description: string }) {
  return (
    <div className="flex justify-between">
      <kbd className="px-2 py-1 bg-gray-100 border rounded text-xs font-mono">
        {shortcut}
      </kbd>
      <span className="text-gray-600">{description}</span>
    </div>
  );
}

13. ASSESSMENT INTERFACES
13.1 Quiz Taking Interface
typescript// components/assessments/QuizTaker.tsx

'use client';

interface QuizTakerProps {
  quiz: Quiz;
  onComplete: (score: number) => void;
}

export function QuizTaker({ quiz, onComplete }: QuizTakerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(
    quiz.time_limit_minutes ? quiz.time_limit_minutes * 60 : null
  );
  const [attemptId, setAttemptId] = useState<number | null>(null);
  
  // Start quiz attempt
  const { mutate: startQuiz } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(`/v1/quizzes/${quiz.id}/start`);
      return response.data;
    },
    onSuccess: (data) => {
      setAttemptId(data.attempt_id);
    }
  });
  
  // Submit quiz
  const { mutate: submitQuiz, isLoading: isSubmitting } = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post(
        `/v1/quizzes/attempts/${attemptId}/submit`,
        { answers }
      );
      return response.data;
    },
    onSuccess: (data) => {
      onComplete(data.score);
    }
  });
  
  // Timer countdown
  useEffect(() => {
    if (!timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 0) {
          // Auto-submit when time expires
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, submitQuiz]);
  
  // Start quiz on mount
  useEffect(() => {
    startQuiz();
  }, []);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every(q => answers[q.id] !== undefined);
  
  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    if (!allQuestionsAnswered) {
      const unanswered = quiz.questions.filter(q => !answers[q.id]);
      toast.error(`Please answer all questions. ${unanswered.length} remaining.`);
      return;
    }
    
    // Confirm before submit
    if (window.confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      submitQuiz();
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
          </div>
          
          {/* Timer */}
          {timeLeft !== null && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Time Remaining</div>
              <div className={`text-2xl font-mono font-bold ${
                timeLeft < 60 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress 
            value={(Object.keys(answers).length / quiz.questions.length) * 100} 
          />
        </div>
      </div>
      
      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-sm text-gray-500 mb-2">
                Question {currentQuestionIndex + 1}
              </div>
              <h2 className="text-xl font-semibold">
                {currentQuestion.question_text}
              </h2>
            </div>
            <Badge variant="outline">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </Badge>
          </div>
          
          {/* Question Image */}
          {currentQuestion.question_image_url && (
            <div className="mt-4">
              <Image
                src={currentQuestion.question_image_url}
                alt="Question image"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <QuestionInput
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={(value) => handleAnswer(currentQuestion.id, value)}
          />
        </CardContent>
      </Card>
      
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {/* Question Navigator */}
        <div className="flex gap-2">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-full border-2 font-semibold ${
                index === currentQuestionIndex
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : answers[q.id]
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !allQuestionsAnswered}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <CheckIcon className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
      
      {/* Auto-save indicator */}
      <div className="text-center text-sm text-gray-500 mt-4">
        <CheckCircleIcon className="w-4 h-4 inline mr-1" />
        Answers are saved automatically
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
13.2 Question Input Components
typescript// components/assessments/QuestionInput.tsx

interface QuestionInputProps {
  question: QuizQuestion;
  value: any;
  onChange: (value: any) => void;
}

export function QuestionInput({ question, value, onChange }: QuestionInputProps) {
  switch (question.question_type) {
    case 'multiple_choice':
      return <MultipleChoiceInput question={question} value={value} onChange={onChange} />;
    
    case 'true_false':
      return <TrueFalseInput value={value} onChange={onChange} />;
    
    case 'fill_blank':
      return <FillBlankInput value={value} onChange={onChange} />;
    
    case 'essay':
      return <EssayInput value={value} onChange={onChange} />;
    
    default:
      return null;
  }
}

function MultipleChoiceInput({ question, value, onChange }: QuestionInputProps) {
  return (
    <RadioGroup value={value?.toString()} onValueChange={(v) => onChange(parseInt(v))}>
      <div className="space-y-3">
        {question.options.map((option) => (
          <div
            key={option.id}
            className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              value === option.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(option.id)}
          >
            <RadioGroupItem value={option.id.toString()} id={`option-${option.id}`} />
            <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer">
              {option.option_text}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
}

function TrueFalseInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="space-y-3">
        <div
          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer ${
            value === 'true' ? 'border-green-500 bg-green-50' : 'border-gray-200'
          }`}
          onClick={() => onChange('true')}
        >
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true" className="flex-1 cursor-pointer font-medium">
            True
          </Label>
        </div>
        
        <div
          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer ${
            value === 'false' ? 'border-red-500 bg-red-50' : 'border-gray-200'
          }`}
          onClick={() => onChange('false')}
        >
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false" className="flex-1 cursor-pointer font-medium">
            False
          </Label>
        </div>
      </div>
    </RadioGroup>
  );
}

function FillBlankInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <Input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your answer here..."
      className="text-lg"
    />
  );
}

function EssayInput({ value, onChange }: Omit<QuestionInputProps, 'question'>) {
  return (
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Write your answer here..."
      rows={10}
      className="text-base"
    />
  );
}
13.3 Quiz Results Display
typescript// components/assessments/QuizResults.tsx

interface QuizResultsProps {
  attempt: QuizAttempt;
  quiz: Quiz;
}

export function QuizResults({ attempt, quiz }: QuizResultsProps) {
  const passed = attempt.score >= quiz.passing_score;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Results Header */}
      <Card className={`mb-8 ${passed ? 'border-green-500' : 'border-red-500'}`}>
        <CardContent className="p-8 text-center">
          <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {passed ? (
              <CheckCircleIcon className="w-16 h-16 text-green-600" />
            ) : (
              <XCircleIcon className="w-16 h-16 text-red-600" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Quiz Not Passed'}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            You scored {attempt.score.toFixed(1)}%
          </p>
          
          <div className="flex justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">{attempt.total_points}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{attempt.max_points}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {formatTime(attempt.time_spent_seconds)}
              </div>
              <div className="text-sm text-gray-600">Time Spent</div>
            </div>
          </div>
          
          {/* Passing Score */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-gray-600">
              Passing score: {quiz.passing_score}%
              {!passed && (
                <span className="ml-2 text-red-600">
                  (You need {(quiz.passing_score - attempt.score).toFixed(1)}% more to pass)
                </span>
              )}
            </p>
          </div>
          
          {/* Attempts */}
          {quiz.attempts_allowed && (
            <p className="text-sm text-gray-500 mt-2">
              Attempt {attempt.attempt_number} of {quiz.attempts_allowed}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Review Answers (if enabled) */}
      {quiz.show_correct_answers && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const userAnswer = attempt.answers.find(a => a.question_id === question.id);
                const isCorrect = userAnswer?.is_correct;
                
                return (
                  <div key={question.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    {/* Question */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Question {index + 1}
                        </div>
                        <h3 className="font-semibold text-lg">
                          {question.question_text}
                        </h3>
                      </div>
                      
                      {isCorrect ? (
                        <Badge variant="success">
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Correct
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XIcon className="w-4 h-4 mr-1" />
                          Incorrect
                        </Badge>
                      )}
                    </div>
                    
                    {/* Your Answer */}
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
                      <div className={`p-3 rounded ${
                        isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                      }`}>
                        {userAnswer?.answer_text}
                      </div>
                    </div>
                    
                    {/* Correct Answer (if wrong) */}
                    {!isCorrect && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
                        <div className="p-3 rounded bg-green-50 border border-green-200">
                          {question.correct_answer_text}
                        </div>
                      </div>
                    )}
                    
                    {/* Explanation */}
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          <InfoIcon className="w-4 h-4 inline mr-1" />
                          Explanation:
                        </p>
                        <p className="text-sm text-blue-800">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        {!passed && quiz.attempts_allowed && attempt.attempt_number < quiz.attempts_allowed && (
          <Button onClick={() => window.location.reload()}>
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Retry Quiz
          </Button>
        )}
        
        <Link href={`/courses/${attempt.course_slug}`}>
          <Button variant="outline">
            Back to Course
          </Button>
        </Link>
      </div>
    </div>
  );
}
13.4 Assignment Submission
typescript// components/assessments/AssignmentSubmission.tsx

'use client';

interface AssignmentSubmissionProps {
  assignment: Assignment;
}

export function AssignmentSubmission({ assignment }: AssignmentSubmissionProps) {
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'link'>(
    assignment.submission_type
  );
  const [textSubmission, setTextSubmission] = useState('');
  const [linkSubmission, setLinkSubmission] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Validate file size
    const oversizedFiles = selectedFiles.filter(
      f => f.size > assignment.max_file_size_mb * 1024 * 1024
    );
    
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed ${assignment.max_file_size_mb}MB limit`);
      return;
    }
    
    // Validate file types
    const invalidFiles = selectedFiles.filter(f => {
      const extension = f.name.split('.').pop()?.toLowerCase();
      return !assignment.allowed_file_types.includes(extension!);
    });
    
    if (invalidFiles.length > 0) {
      toast.error(`Only ${assignment.allowed_file_types.join(', ')} files are allowed`);
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      if (submissionType === 'text') {
        formData.append('submission_text', textSubmission);
      } else if (submissionType === 'link') {
        formData.append('submission_url', linkSubmission);
      } else if (submissionType === 'file') {
        files.forEach(file => {
          formData.append('files[]', file);
        });
      }
      
      await apiClient.post(
        `/v1/assignments/${assignment.id}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      toast.success('Assignment submitted successfully!');
      router.push(`/assignments/${assignment.id}/confirmation`);
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const isLate = assignment.due_date && new Date() > new Date(assignment.due_date);
  const canSubmit = isLate ? assignment.late_submission_allowed : true;
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{assignment.title}</CardTitle>
              <CardDescription className="mt-2">
                {assignment.description}
              </CardDescription>
            </div>
            
            <Badge variant="outline">{assignment.points} points</Badge>
          </div>
          
          {/* Due Date */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center text-sm">
              <CalendarIcon className="w-4 h-4 mr-2" />
              <span className={isLate ? 'text-red-600 font-semibold' : ''}>
                Due: {formatDate(assignment.due_date)}
              </span>
            </div>
            
            {isLate && (
              <Badge variant="destructive">Overdue</Badge>
            )}
          </div>
          
          {/* Instructions Document */}
          {assignment.instructions_document_url && (
            <div className="mt-4">
              
                href={assignment.instructions_document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <FileTextIcon className="w-4 h-4 mr-2" />
                Download Instructions
              </a>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          {canSubmit ? (
            <div className="space-y-6">
              {/* Submission Type Selector */}
              {assignment.submission_type === 'multiple_files' && (
                <RadioGroup value={submissionType} onValueChange={setSubmissionType as any}>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="file" />
                      <Label htmlFor="file">Upload Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text">Text Submission</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="link" id="link" />
                      <Label htmlFor="link">Link Submission</Label>
                    </div>
                  </div>
                </RadioGroup>
              )}
              
              {/* Text Submission */}
              {submissionType === 'text' && (
                <div>
                  <Label htmlFor="text-submission">Your Submission</Label>
                  <Textarea
                    id="text-submission"
                    value={textSubmission}
                    onChange={(e) => setTextSubmission(e.target.value)}
                    placeholder="Type or paste your submission here..."
                    rows={15}
                    className="mt-2"
                  />
                </div>
              )}
              
              {/* Link Submission */}
              {submissionType === 'link' && (
                <div>
                  <Label htmlFor="link-submission">Submission URL</Label>
                  <Input
                    id="link-submission"
                    type="url"
                    value={linkSubmission}
                    onChange={(e) => setLinkSubmission(e.target.value)}
                    placeholder="https://..."
                    className="mt-2"
                  />
                </div>
              )}
              
              {/* File Upload */}
              {submissionType === 'file' && (
                <div>
                  <Label>Upload Files</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        multiple={assignment.submission_type === 'multiple_files'}
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                        accept={assignment.allowed_file_types.map(t => `.${t}`).join(',')}
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {assignment.allowed_file_types.join(', ')} up to {assignment.max_file_size_mb}MB
                        </p>
                      </label>
                    </div>
                    
                    {/* Uploaded Files List */}
                    {files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <FileIcon className="w-5 h-5 mr-3 text-gray-500" />
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <XIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Late Penalty Warning */}
              {isLate && assignment.late_penalty_percent > 0 && (
                <Alert variant="warning">
                  <AlertTriangleIcon className="w-4 h-4" />
                  <AlertTitle>Late Submission</AlertTitle>
                  <AlertDescription>
                    This submission is late. A {assignment.late_penalty_percent}% penalty will be applied to your grade.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || (
                    submissionType === 'text' && !textSubmission ||
                    submissionType === 'link' && !linkSubmission ||
                    submissionType === 'file' && files.length === 0
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Alert variant="destructive">
              <XCircleIcon className="w-4 h-4" />
              <AlertTitle>Submissions Closed</AlertTitle>
              <AlertDescription>
                The due date has passed and late submissions are not allowed for this assignment.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

This is Part 2 of the Frontend Brief