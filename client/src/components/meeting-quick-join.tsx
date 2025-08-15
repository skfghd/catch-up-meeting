import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Users, ExternalLink, Clock, Calendar } from "lucide-react";

interface QuickJoinProps {
  onJoin?: (platform: 'zoom' | 'teams', url: string) => void;
}

export default function MeetingQuickJoin({ onJoin }: QuickJoinProps) {
  const [meetingUrl, setMeetingUrl] = useState("");

  const detectPlatform = (url: string): 'zoom' | 'teams' | 'unknown' => {
    if (url.includes('zoom.us') || url.includes('zoom.com')) return 'zoom';
    if (url.includes('teams.microsoft.com')) return 'teams';
    return 'unknown';
  };

  const handleQuickJoin = () => {
    if (!meetingUrl.trim()) return;

    const platform = detectPlatform(meetingUrl);
    if (platform !== 'unknown') {
      onJoin?.(platform, meetingUrl);
      window.open(meetingUrl, '_blank');
      setMeetingUrl("");
    }
  };

  const platform = detectPlatform(meetingUrl);

  // 최근 회의 목록 (샘플 데이터)
  const recentMeetings = [
    {
      id: 1,
      name: "주간 스프린트 회의",
      platform: "zoom" as const,
      url: "https://zoom.us/j/123456789",
      time: "10:00 AM",
      status: "진행중"
    },
    {
      id: 2,
      name: "제품 기획 리뷰",
      platform: "teams" as const,
      url: "https://teams.microsoft.com/l/meetup-join/19:meeting_123",
      time: "2:00 PM",
      status: "예정"
    }
  ];

  const getPlatformIcon = (platform: 'zoom' | 'teams') => {
    return platform === 'zoom' ? (
      <Video className="h-4 w-4" />
    ) : (
      <Users className="h-4 w-4" />
    );
  };

  const getPlatformColor = (platform: 'zoom' | 'teams') => {
    return platform === 'zoom' ? 'bg-blue-500' : 'bg-purple-500';
  };

  return (
    <div className="space-y-4">
      {/* 빠른 참여 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">빠른 회의 참여</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 직접 입력 섹션 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">회의 링크 입력</h4>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="회의 링크를 입력하세요 (Zoom 또는 Teams)"
                  value={meetingUrl}
                  onChange={(e) => setMeetingUrl(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuickJoin()}
                />
                {meetingUrl && platform !== 'unknown' && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-4 h-4 rounded ${getPlatformColor(platform)} flex items-center justify-center text-white`}>
                      {getPlatformIcon(platform)}
                    </div>
                    <span className="text-sm text-muted-foreground capitalize">
                      {platform} 회의로 감지됨
                    </span>
                  </div>
                )}
              </div>
              <Button 
                onClick={handleQuickJoin}
                disabled={!meetingUrl.trim() || platform === 'unknown'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                참여
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}