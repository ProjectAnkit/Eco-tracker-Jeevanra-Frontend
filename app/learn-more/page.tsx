"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Leaf, Bike, Utensils, Zap, Clock, ArrowRight } from "lucide-react";
import AuthForm from "@/components/authForm";

const blogPosts = [
  {
    id: 1,
    title: "Reducing Your Carbon Footprint",
    summary: "Learn how tracking daily activities can significantly lower your CO2 emissions.",
    icon: Leaf,
    href: "/blog/reducing-carbon-footprint",
    readTime: "8 min",
    date: "Aug 24, 2023",
    author: "Sarah Johnson",
    category: "Lifestyle"
  },
  {
    id: 2,
    title: "Eco-Friendly Commuting",
    summary: "Explore sustainable transportation options for a greener commute.",
    icon: Bike,
    href: "/blog/eco-friendly-commuting",
    readTime: "6 min",
    date: "Aug 18, 2023",
    author: "Michael Chen",
    category: "Transportation"
  },
  {
    id: 3,
    title: "The Power of Plant-Based Diets",
    summary: "Discover how plant-based meals can cut your carbon emissions.",
    icon: Utensils,
    href: "/blog/plant-based-diets",
    readTime: "10 min",
    date: "Aug 10, 2023",
    author: "Emma Rodriguez",
    category: "Food"
  },
  {
    id: 4,
    title: "Sustainable Living at Home",
    summary: "Learn how to reduce household energy use and lower your bills.",
    icon: Zap,
    href: "/blog/sustainable-living-home",
    readTime: "7 min",
    date: "Aug 2, 2023",
    author: "David Kim",
    category: "Home"
  }
];

export default function LearnMore() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50 dark:from-slate-900 dark:via-emerald-900/30 dark:to-cyan-900/20 relative overflow-hidden flex flex-col items-center">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200 dark:bg-emerald-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-200 dark:bg-cyan-800/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 dark:bg-amber-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      {/* Nature-inspired background wave */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-auto opacity-20 dark:opacity-10"
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            className="text-emerald-300 dark:text-emerald-700"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 w-full flex flex-col items-center px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-4xl text-center space-y-8"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-100 flex flex-col items-center gap-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Leaf className="h-10 w-10 text-emerald-600" />
          Learn More About Sustainable Living
        </motion.h1>
        <p className="text-lg md:text-xl text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-3xl mx-auto pb-10">
          Explore our upcoming blog posts with tips and strategies for reducing your carbon footprint and living a greener life with Jeevanra.
        </p>
      </motion.div>
      

      {/* Blog Posts */}
      <div className="w-full max-w-4xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <div className="relative h-full">
              <Card className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-emerald-100 dark:border-emerald-900 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <post.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl md:text-2xl text-emerald-900 dark:text-white line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.summary}
                  </p>
                  <div className="mt-auto pt-4 border-t border-emerald-50 dark:border-emerald-900/50">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <span>Coming Soon</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                  <Clock className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Coming Soon</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">This article is in the works</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="w-full max-w-4xl text-center mt-12 z-10 px-4 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-emerald-800 dark:text-emerald-100 mb-6">
          Join Our Community
        </h2>
        <p className="text-lg text-emerald-700 dark:text-emerald-300 mb-8 max-w-2xl mx-auto">
          Ready to make a difference? Join Jeevanra and start your sustainability journey today.
        </p>
        <div className="flex justify-center">
          <AuthForm />
        </div>
      </motion.div>
      </div>
    </div>
  );
}