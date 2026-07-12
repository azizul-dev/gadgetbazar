import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — GadgetBazar",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to Home
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 text-white shadow-md">
          <ShieldCheck size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Privacy Policy</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <p>
          At GadgetBazar, we respect your privacy and are committed to protecting the
          personal information you share with us. This Privacy Policy explains what
          data we collect, how we use it, and the choices you have.
        </p>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Information We Collect</h2>
          <p>
            When you register, we collect your name, email address, and a securely
            hashed password. When you create a listing, we store the details you
            provide about the item, including title, description, price, location,
            and any images you add.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">How We Use Your Information</h2>
          <p>
            Your information is used to operate your account, display your listings
            to other users, enable communication between buyers and sellers, and
            improve our platform. We do not sell your personal data to third parties.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Data Security</h2>
          <p>
            Passwords are stored using industry-standard hashing. Sessions are managed
            through secure, httpOnly cookies. We take reasonable technical measures to
            protect your data, though no online service can guarantee absolute security.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Your Choices</h2>
          <p>
            You can update or delete your listings at any time from your dashboard.
            To request deletion of your account entirely, please contact us using the
            details on our Contact page.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Continued use of GadgetBazar
            after changes are posted constitutes acceptance of the revised policy.
          </p>
        </div>

        <p className="text-xs text-gray-400">Last updated: July 2026</p>
      </div>
    </div>
  );
}
