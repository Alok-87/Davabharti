"use client";
import { useEffect } from "react";

export default function ReferralPage() {
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = userAgent.includes("android");
    const isIOS = /iphone|ipad|ipod/.test(userAgent);

    const ref = new URLSearchParams(window.location.search).get("ref");

    // your app deep link
    const appLink = `davabharti://referral?ref=${ref}`;

    // Play Store / App Store
    const playStoreLink = "https://play.google.com/store/apps/details?id=com.davaBharti";
    const appStoreLink = "https://apps.apple.com/us/app/dava-bharti-online-healthcare/id6443840560";

    if (isAndroid || isIOS) {
      // Try opening the app
      window.location.href = appLink;

      // If app is not installed → fallback to store
      setTimeout(() => {
        if (isAndroid) {
          window.location.href = playStoreLink;
        } else if (isIOS) {
          window.location.href = appStoreLink;
        }
      }, 1500);
    } else {
      // Desktop → open website register page
      window.location.href = `/?ref=${ref}`;
    }
  }, []);

  return (
    <div className="p-10 text-center">
      <h2>Opening App...</h2>
      <p>If nothing happens, redirecting to store.</p>
    </div>
  );
}
