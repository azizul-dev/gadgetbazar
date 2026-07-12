import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service — GadgetBazar",
};

export default function TermsPage() {
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
          <FileText size={20} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Terms of Service</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-gray-600">
        <p>
          Welcome to GadgetBazar. By creating an account or using our platform, you
          agree to the following terms. Please read them carefully.
        </p>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">1. Using the Platform</h2>
          <p>
            GadgetBazar is a marketplace where users can list second-hand gadgets for
            sale and browse listings from other users. You must provide accurate
            information when creating a listing, including an honest description of
            the item&rsquo;s condition.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">2. Account Responsibility</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account
            credentials and for all activity that occurs under your account.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">3. Transactions Between Users</h2>
          <p>
            GadgetBazar connects buyers and sellers but is not a party to any
            transaction between them. Payment, delivery, and inspection of items are
            arranged directly between the buyer and seller. We encourage users to meet
            in safe, public locations and verify items before completing a purchase.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">4. Prohibited Listings</h2>
          <p>
            Listings for stolen, counterfeit, illegal, or unsafe items are strictly
            prohibited and will be removed. Repeated violations may result in account
            suspension.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">5. Limitation of Liability</h2>
          <p>
            GadgetBazar is provided on an &ldquo;as is&rdquo; basis. We are not liable for
            disputes, losses, or damages arising from transactions conducted between
            users on the platform.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-semibold text-gray-900">6. Changes to These Terms</h2>
          <p>
            We may revise these terms from time to time. Continued use of the platform
            after changes are posted constitutes acceptance of the updated terms.
          </p>
        </div>

        <p className="text-xs text-gray-400">Last updated: July 2026</p>
      </div>
    </div>
  );
}
