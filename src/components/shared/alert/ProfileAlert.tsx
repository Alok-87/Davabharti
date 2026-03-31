"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ProfileAlertDialogProps {
  isAddress?:boolean,
  open: boolean;
  onClose: () => void;
}

const ProfileAlertDialog: React.FC<ProfileAlertDialogProps> = ({ open, onClose ,isAddress=false}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleCompleteProfile = () => {
    setIsOpen(false);
    onClose();
    router.push("/user");
  };

  const handleCancel = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            Profile Incomplete
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            Please complete your profile before
            proceeding to add {isAddress?"new Address.":"items to your cart."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCompleteProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Complete Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProfileAlertDialog;
