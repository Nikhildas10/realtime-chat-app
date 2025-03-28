"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Menu, LogOut, Settings, UserIcon, Upload } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
}

interface SidebarProps {
  conversations: Conversation[];
  selectedConversation: number | null;
  onSelectConversation: (id: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isMobile: boolean;
}

export function Sidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  isMobile,
}: SidebarProps) {
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [userName, setUserName] = useState("Your Name");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=40&width=40"
  );
  const [tempUserName, setTempUserName] = useState(userName);
  const [tempProfileImage, setTempProfileImage] = useState(profileImage);
  const [isDragging, setIsDragging] = useState(false);

  const handleProfileUpdate = () => {
    setUserName(tempUserName);
    setProfileImage(tempProfileImage);
    setProfileDialogOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setTempProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={`border-r border-gray-200 w-full ${isMobile ? "w-full" : "w-80"}`}
    >
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">Chats</h1>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-black">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-3 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profileImage} alt={userName} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-black">{userName}</p>
                    <p className="text-sm text-gray-500">Online</p>
                  </div>
                </div>
                <Separator />
                <nav className="flex-1 p-4">
                  <ul className="space-y-2">
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start cursor-pointer text-black"
                        onClick={() => {
                          setTempUserName(userName);
                          setTempProfileImage(profileImage);
                          setProfileDialogOpen(true);
                        }}
                      >
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full cursor-pointer justify-start text-black"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </li>
                  </ul>
                </nav>
                <div className="p-4">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer border-black text-black"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="px-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search conversations"
            className="pl-10 border-black focus-visible:ring-black"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="p-2">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedConversation === conversation.id
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={conversation.avatar || "/placeholder.svg"}
                    alt={conversation.name}
                  />
                  <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-black truncate">
                      {conversation.name}
                    </p>
                    <p className="text-xs text-gray-500">{conversation.time}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black rounded-full">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Profile Dialog */}
      <Dialog open={profileDialogOpen} onOpenChange={setProfileDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white border-0">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="flex flex-col items-center gap-4">
              <div
                className={`relative group cursor-pointer rounded-full overflow-hidden w-24 h-24 border-2 ${isDragging ? "border-black border-dashed" : "border-gray-200"}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Avatar className="w-full h-full">
                  <AvatarImage src={tempProfileImage} alt={tempUserName} />
                  <AvatarFallback>{tempUserName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute group-hover:inset-0  opacity-0 bg-black group-hover:opacity-30 transition-all flex items-center justify-center">
                  <Upload className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-sm text-gray-500">
                Click or drag & drop to change profile picture
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={tempUserName}
                onChange={(e) => setTempUserName(e.target.value)}
                className="border-black focus-visible:ring-black"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="border-black cursor-pointer text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleProfileUpdate}
              className="bg-black text-white cursor-pointer hover:bg-gray-800"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
