"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { Camera, Loader2, Upload } from "lucide-react";

interface AvatarUploadProps {
    uid: string;
    url: string | null;
    size?: number;
    onUpload: (url: string) => void;
}

export default function AvatarUpload({ uid, url, size = 150, onUpload }: AvatarUploadProps) {
    const supabase = createClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) downloadImage(url);
    }, [url]);

    async function downloadImage(path: string) {
        try {
            // If it's a full URL, just use it 
            if (path.startsWith('http')) {
                setAvatarUrl(path);
                return;
            }

            // Otherwise download from bucket
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            console.log('Error downloading image: ', error);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const filePath = `${uid}/${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            onUpload(publicUrl);

            // Optimistic update for local view
            setAvatarUrl(publicUrl);

            toast.success("Avatar uploaded!");
        } catch (error) {
            toast.error("Error uploading avatar");
            console.log(error);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-white shadow-xl dark:border-slate-800">
                    <AvatarImage src={avatarUrl || ""} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-slate-200 dark:bg-slate-700">
                        {/* Fallback handled by parent usually, but we can put icon here */}
                        <Camera className="h-10 w-10 text-slate-400" />
                    </AvatarFallback>
                </Avatar>

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Label htmlFor="single" className="cursor-pointer flex flex-col items-center text-white font-medium">
                        <Upload className="h-6 w-6 mb-1" />
                        <span>Change</span>
                    </Label>
                </div>
            </div>

            <div className="hidden">
                <Input
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>

            {uploading && (
                <div className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </div>
            )}
        </div>
    );
}
