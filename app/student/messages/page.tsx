import { MessageSquare, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/student/page-header";
import { STUDENT_MESSAGES } from "@/lib/student-mock-data";

export default function MessagesPage() {
  const unreadMessages = STUDENT_MESSAGES.filter(m => !m.is_read);
  const readMessages = STUDENT_MESSAGES.filter(m => m.is_read);

  return (
    <div>
      <PageHeader
        title="Messages"
        description="Communicate with instructors and classmates"
      />

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total Conversations</p>
          <p className="text-2xl font-bold">5</p>
        </Card>
        <Card className="p-4 text-center border-blue-200 bg-blue-50">
          <p className="text-sm text-blue-700">Unread</p>
          <p className="text-2xl font-bold text-blue-700">{unreadMessages.length}</p>
        </Card>
        <Card className="p-4 text-center border-green-200 bg-green-50">
          <p className="text-sm text-green-700">All Messages</p>
          <p className="text-2xl font-bold text-green-700">{STUDENT_MESSAGES.length}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Conversations</h3>
            <div className="space-y-2">
              {/* Unread Conversations */}
              {unreadMessages.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">UNREAD</p>
                  {unreadMessages.map(msg => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <p className="font-semibold text-sm">{msg.sender_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Read Conversations */}
              {readMessages.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1 mt-4">ALL</p>
                  {readMessages.map(msg => (
                    <div
                      key={msg.id}
                      className="p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                      <p className="font-medium text-sm">{msg.sender_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            {unreadMessages.length > 0 && (
              <>
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {unreadMessages[0].sender_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{unreadMessages[0].sender_name}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                </div>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  <div className="flex justify-start">
                    <div className="max-w-xs px-4 py-2 rounded-lg bg-muted">
                      <p className="text-sm">{unreadMessages[0].content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(unreadMessages[0].timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}

            {unreadMessages.length === 0 && readMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="font-semibold mb-1">No Messages</p>
                <p className="text-sm text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
