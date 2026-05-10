import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ui/ThemeToggle";

interface CommunityPost {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
    location: string;
  };
  postTime: string;
  tripTitle: string;
  description: string;
  images: string[];
  metadata: {
    destination: string;
    duration: string;
    budget: string;
    tripType: string;
    season: string;
  };
  engagement: {
    likes: number;
    comments: number;
    saves: number;
    shares: number;
  };
  topComments: Array<{
    user: string;
    text: string;
  }>;
}

const CommunityPage: React.FC = () => {
  const { dark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [groupBy, setGroupBy] = useState("recent");
  const [sortBy, setSortBy] = useState("trending");

  const [posts] = useState<CommunityPost[]>([
    {
      id: "1",
      user: {
        name: "Sarah Johnson",
        username: "sarahtravels",
        avatar: "https://i.pravatar.cc/150?img=1",
        verified: true,
        location: "New York, USA",
      },
      postTime: "2 hours ago",
      tripTitle: "Best hidden cafes in Kyoto",
      description:
        "Discovered these amazing local spots away from tourist crowds. The matcha here is absolutely incredible!",
      images: [
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80",
        "https://images.unsplash.com/photo-1528164344705-47542687000d?w=600&q=80",
      ],
      metadata: {
        destination: "Kyoto, Japan",
        duration: "7 Days",
        budget: "Mid-range",
        tripType: "Solo",
        season: "Spring",
      },
      engagement: {
        likes: 234,
        comments: 45,
        saves: 89,
        shares: 12,
      },
      topComments: [
        { user: "traveler_mike", text: "This looks amazing! Adding to my list" },
        { user: "wanderlust_jane", text: "Which cafe was your favorite?" },
      ],
    },
    {
      id: "2",
      user: {
        name: "Alex Chen",
        username: "alexexplores",
        avatar: "https://i.pravatar.cc/150?img=12",
        verified: false,
        location: "Singapore",
      },
      postTime: "5 hours ago",
      tripTitle: "Budget Bali itinerary under ₹20k",
      description:
        "Complete 5-day Bali trip on a budget! Stayed in hostels, ate local food, and still had an amazing time.",
      images: [
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80",
      ],
      metadata: {
        destination: "Bali, Indonesia",
        duration: "5 Days",
        budget: "Budget",
        tripType: "Solo",
        season: "Summer",
      },
      engagement: {
        likes: 567,
        comments: 123,
        saves: 234,
        shares: 45,
      },
      topComments: [
        { user: "budget_traveler", text: "This is so helpful! Thanks for sharing" },
      ],
    },
  ]);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: dark ? "#1C1612" : "#FAF6F0" }}
    >
      {/* Background blobs */}
      <div
        className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "#D4A373" }}
      />
      <div
        className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "#C65D3A" }}
      />

      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: dark ? "rgba(28,22,18,0.88)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: dark
            ? "1px solid rgba(61,46,34,0.8)"
            : "1px solid rgba(230,211,179,0.6)",
          boxShadow: "0 2px 12px rgba(198,93,58,0.07)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <img src="/Traveloop.png" alt="Traveloop" className="h-9" />
            </Link>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)",
                  border: "1.5px solid rgba(198,93,58,0.3)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#C65D3A"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </button>
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:opacity-70"
                style={{
                  background: dark ? "rgba(42,33,26,0.9)" : "rgba(243,233,220,0.8)",
                  border: "1.5px solid rgba(198,93,58,0.3)",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="#C65D3A"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content - Three Column Layout */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Center Feed - Takes 8 columns */}
          <div className="lg:col-span-8 xl:col-span-8">
            <h1
              className="text-3xl font-bold mb-6"
              style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
            >
              Community
            </h1>

            {/* Search & Controls - Sticky */}
            <div
              className="sticky top-[72px] z-40 rounded-2xl p-4 mb-6"
              style={{
                background: dark ? "rgba(28,22,18,0.92)" : "rgba(250,246,240,0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: dark
                  ? "1px solid rgba(198,93,58,0.3)"
                  : "1px solid rgba(255,255,255,0.5)",
                boxShadow: dark
                  ? "0 8px 32px rgba(0,0,0,0.4), 0 0 40px rgba(198,93,58,0.1)"
                  : "0 8px 32px rgba(198,93,58,0.12)",
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by destination, activity, hashtags, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={{
                      background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                      border: dark
                        ? "1px solid rgba(61,46,34,0.9)"
                        : "1px solid rgba(255,255,255,0.45)",
                      color: dark ? "#F0E6D3" : "#3B2F2F",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                    fill="none"
                    stroke="#C65D3A"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className="flex-1 min-w-[140px] px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={{
                      background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                      border: dark
                        ? "1px solid rgba(61,46,34,0.9)"
                        : "1px solid rgba(255,255,255,0.45)",
                      color: dark ? "#F0E6D3" : "#3B2F2F",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    <option value="recent" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>Recent</option>
                    <option value="destination" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>By Destination</option>
                    <option value="tripType" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>By Trip Type</option>
                    <option value="popularity" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>By Popularity</option>
                  </select>

                  <button
                    className="px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
                    style={{
                      background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                      border: dark
                        ? "1px solid rgba(61,46,34,0.9)"
                        : "1px solid rgba(255,255,255,0.45)",
                      color: dark ? "#F0E6D3" : "#3B2F2F",
                    }}
                  >
                    Filter
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="flex-1 min-w-[120px] px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    style={{
                      background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.35)",
                      border: dark
                        ? "1px solid rgba(61,46,34,0.9)"
                        : "1px solid rgba(255,255,255,0.45)",
                      color: dark ? "#F0E6D3" : "#3B2F2F",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)",
                    }}
                  >
                    <option value="trending" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>Trending</option>
                    <option value="mostLiked" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>Most Liked</option>
                    <option value="mostRecent" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>Most Recent</option>
                    <option value="mostSaved" style={{ background: dark ? "#2A211A" : "#FFFFFF", color: dark ? "#F0E6D3" : "#3B2F2F" }}>Most Saved</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Feed */}
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} dark={dark} />
              ))}
            </div>
          </div>

          {/* Right Sidebar - Takes 4 columns */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="sticky top-[72px] space-y-5">
              <RightSidebarPanel dark={dark} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface PostCardProps {
  post: CommunityPost;
  dark: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, dark }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl"
      style={{
        background: dark ? "rgba(42,33,26,0.7)" : "rgba(255,255,255,0.6)",
        border: dark
          ? "1px solid rgba(61,46,34,0.8)"
          : "1px solid rgba(230,211,179,0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: dark
          ? "0 4px 12px rgba(0,0,0,0.3)"
          : "0 4px 12px rgba(198,93,58,0.12)",
      }}
    >
      {/* User Info */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover"
            style={{
              border: dark
                ? "2px solid rgba(61,46,34,0.8)"
                : "2px solid rgba(255,255,255,0.6)",
            }}
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-sm"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {post.user.name}
              </span>
              {post.user.verified && (
                <svg
                  className="w-4 h-4"
                  fill="#2196F3"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </div>
            <p
              className="text-xs"
              style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
            >
              {post.user.location} • {post.postTime}
            </p>
          </div>
        </div>
        <button
          className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:opacity-80"
          style={{
            background: "#C65D3A",
            color: "white",
          }}
        >
          Follow
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          {post.tripTitle}
        </h3>
        <p
          className="text-sm mb-3"
          style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
        >
          {post.description}
        </p>
      </div>

      {/* Images with Carousel Indicators */}
      <div className="relative">
        <div className={`grid ${post.images.length > 1 ? "grid-cols-2" : "grid-cols-1"} gap-1`}>
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${post.tripTitle} ${idx + 1}`}
              className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              onClick={() => setCurrentImageIndex(idx)}
            />
          ))}
        </div>
        {/* Image Indicators */}
        {post.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {post.images.map((_, idx) => (
              <div
                key={idx}
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{
                  background: idx === currentImageIndex ? "#C65D3A" : "rgba(255,255,255,0.5)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Metadata Tags */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            background: dark ? "rgba(198,93,58,0.2)" : "rgba(198,93,58,0.15)",
            color: "#C65D3A",
          }}
        >
          {post.metadata.destination}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs"
          style={{
            background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)",
            color: dark ? "#F0E6D3" : "#3B2F2F",
          }}
        >
          {post.metadata.duration}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs"
          style={{
            background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)",
            color: dark ? "#F0E6D3" : "#3B2F2F",
          }}
        >
          {post.metadata.budget}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs"
          style={{
            background: dark ? "rgba(61,46,34,0.5)" : "rgba(255,255,255,0.5)",
            color: dark ? "#F0E6D3" : "#3B2F2F",
          }}
        >
          {post.metadata.tripType}
        </span>
      </div>

      {/* Engagement Actions with Divider */}
      <div
        className="px-4 py-3"
        style={{
          borderTop: dark
            ? "1px solid rgba(61,46,34,0.6)"
            : "1px solid rgba(230,211,179,0.4)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <svg
                className="w-5 h-5 transition-all duration-200"
                fill={liked ? "#C65D3A" : "none"}
                stroke={liked ? "#C65D3A" : dark ? "#F0E6D3" : "#3B2F2F"}
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: liked ? "#C65D3A" : dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {post.engagement.likes + (liked ? 1 : 0)}
              </span>
            </button>

            <button className="flex items-center gap-2 transition-all duration-200 hover:scale-110 active:scale-95">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke={dark ? "#F0E6D3" : "#3B2F2F"}
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {post.engagement.comments}
              </span>
            </button>

            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <svg
                className="w-5 h-5 transition-all duration-200"
                fill={saved ? "#C65D3A" : "none"}
                stroke={saved ? "#C65D3A" : dark ? "#F0E6D3" : "#3B2F2F"}
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: saved ? "#C65D3A" : dark ? "#F0E6D3" : "#3B2F2F" }}
              >
                {post.engagement.saves + (saved ? 1 : 0)}
              </span>
            </button>
          </div>

          <button className="transition-all duration-200 hover:scale-110 active:scale-95">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke={dark ? "#F0E6D3" : "#3B2F2F"}
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Comments Preview */}
      {post.topComments.length > 0 && (
        <div className="px-4 pb-4">
          <div className="space-y-2">
            {post.topComments.map((comment, idx) => (
              <p
                key={idx}
                className="text-sm"
                style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
              >
                <span className="font-semibold">{comment.user}</span> {comment.text}
              </p>
            ))}
          </div>
          <button
            className="text-xs mt-2 font-medium"
            style={{ color: "#C65D3A" }}
          >
            View all {post.engagement.comments} comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityPage;

// Right Sidebar Panel Component
const RightSidebarPanel: React.FC<{ dark: boolean }> = ({ dark }) => {
  return (
    <div className="space-y-6">
      {/* Top Posts */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: dark
            ? "1px solid rgba(198,93,58,0.3)"
            : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark
            ? "0 4px 16px rgba(0,0,0,0.3), 0 0 30px rgba(198,93,58,0.08)"
            : "0 4px 16px rgba(198,93,58,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-base font-bold"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Top Posts
          </h3>
          <button
            className="text-xs font-semibold transition-all duration-200 hover:opacity-70"
            style={{ color: "#C65D3A" }}
          >
            View all
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              title: "Maldives on a budget",
              author: "Emma Wilson",
              likes: "1.2K",
              comments: 128,
              img: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=200&q=80",
            },
            {
              title: "Trekking the Himalayas",
              author: "James Carter",
              likes: 984,
              comments: 97,
              img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80",
            },
            {
              title: "Peru in 10 days itinerary",
              author: "Sophia Lee",
              likes: 876,
              comments: 64,
              img: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=200&q=80",
            },
            {
              title: "Sunset views in Santorini",
              author: "Liam Brown",
              likes: 754,
              comments: 53,
              img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=200&q=80",
            },
            {
              title: "7 days in Bali",
              author: "Olivia Davis",
              likes: 689,
              comments: 48,
              img: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80",
            },
          ].map((post, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
            >
              <div
                className="w-20 h-20 rounded-xl bg-cover bg-center flex-shrink-0"
                style={{
                  backgroundImage: `url(${post.img})`,
                  border: dark
                    ? "1px solid rgba(61,46,34,0.6)"
                    : "1px solid rgba(230,211,179,0.4)",
                }}
              />
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-semibold mb-1 line-clamp-2"
                  style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
                >
                  {post.title}
                </h4>
                <p
                  className="text-xs mb-2"
                  style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
                >
                  {post.author}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke={dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)"}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span
                      className="text-xs"
                      style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}
                    >
                      {post.likes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke={dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)"}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span
                      className="text-xs"
                      style={{ color: dark ? "rgba(240,230,211,0.5)" : "rgba(59,47,47,0.5)" }}
                    >
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested for you */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: dark
            ? "1px solid rgba(198,93,58,0.3)"
            : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark
            ? "0 4px 16px rgba(0,0,0,0.3), 0 0 30px rgba(198,93,58,0.08)"
            : "0 4px 16px rgba(198,93,58,0.12)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-base font-bold"
            style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
          >
            Suggested for you
          </h3>
          <button
            className="text-xs font-semibold transition-all duration-200 hover:opacity-70"
            style={{ color: "#C65D3A" }}
          >
            View all
          </button>
        </div>
        <div className="space-y-4">
          {[
            {
              name: "Chris Explorer",
              bio: "Digital Nomad",
              followers: "24K followers",
              avatar: "https://i.pravatar.cc/80?img=12",
            },
            {
              name: "Travel With Me",
              bio: "Adventure Lover",
              followers: "18K followers",
              avatar: "https://i.pravatar.cc/80?img=5",
            },
            {
              name: "Wander Diaries",
              bio: "Solo Traveler",
              followers: "15K followers",
              avatar: "https://i.pravatar.cc/80?img=1",
            },
          ].map((user, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full flex-shrink-0"
                  style={{
                    border: dark
                      ? "2px solid rgba(61,46,34,0.6)"
                      : "2px solid rgba(230,211,179,0.4)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: dark ? "rgba(240,230,211,0.6)" : "rgba(59,47,47,0.6)" }}
                  >
                    {user.bio} • {user.followers}
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 hover:opacity-80 flex-shrink-0"
                style={{
                  background: "transparent",
                  border: "1.5px solid #C65D3A",
                  color: "#C65D3A",
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Destinations */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: dark ? "rgba(28,22,18,0.72)" : "rgba(250,246,240,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: dark
            ? "1px solid rgba(198,93,58,0.3)"
            : "1px solid rgba(255,255,255,0.5)",
          boxShadow: dark
            ? "0 4px 16px rgba(0,0,0,0.3), 0 0 30px rgba(198,93,58,0.08)"
            : "0 4px 16px rgba(198,93,58,0.12)",
        }}
      >
        <h3
          className="text-base font-bold mb-4"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          Trending Destinations
        </h3>
        <div className="space-y-2">
          {["Bali, Indonesia", "Paris, France", "Tokyo, Japan", "Santorini, Greece"].map(
            (dest, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                style={{
                  background: dark ? "rgba(61,46,34,0.3)" : "rgba(255,255,255,0.4)",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
                >
                  {dest}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "#C65D3A" }}
                >
                  {1200 - idx * 150} posts
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Travel Tips */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: dark
            ? "linear-gradient(135deg, rgba(198,93,58,0.15) 0%, rgba(28,22,18,0.72) 100%)"
            : "linear-gradient(135deg, rgba(198,93,58,0.1) 0%, rgba(250,246,240,0.55) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: dark
            ? "1px solid rgba(198,93,58,0.4)"
            : "1px solid rgba(198,93,58,0.3)",
          boxShadow: dark
            ? "0 4px 16px rgba(0,0,0,0.3), 0 0 40px rgba(198,93,58,0.15)"
            : "0 4px 16px rgba(198,93,58,0.15)",
        }}
      >
        <h3
          className="text-sm font-bold mb-3"
          style={{ color: dark ? "#F0E6D3" : "#3B2F2F" }}
        >
          Travel Tip of the Day
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{ color: dark ? "rgba(240,230,211,0.8)" : "rgba(59,47,47,0.8)" }}
        >
          Book flights on Tuesday afternoons for the best deals. Airlines typically release
          discounts early in the week!
        </p>
      </div>
    </div>
  );
};
