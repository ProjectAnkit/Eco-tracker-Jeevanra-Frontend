"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Leaf, Bike, Utensils, Zap } from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-emerald-200 dark:from-emerald-900 dark:to-emerald-950 flex flex-col items-center px-4 py-12 relative overflow-hidden">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center space-y-8 z-10 mb-12"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-emerald-800 dark:text-emerald-100 flex items-center justify-center gap-3"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Leaf className="h-10 w-10 text-emerald-600" />
          Learn More About Sustainable Living
        </motion.h1>
        <p className="text-lg md:text-xl text-emerald-700 dark:text-emerald-300 leading-relaxed max-w-3xl mx-auto">
          Dive into our blog to explore tips, insights, and strategies for reducing your carbon footprint and living a greener life with Jeevanra.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            asChild
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300"
          >
            <Link href="/track">Start Tracking Now</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Blog Posts */}
      <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 z-10">
        {blogPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <Card className="bg-white/80 dark:bg-emerald-800/50 backdrop-blur-md border-none rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <CardHeader className="flex items-center space-x-4">
                <post.icon className="h-8 w-8 text-emerald-600" />
                <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-100">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-4">
                  {post.summary}
                </p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-full px-6 py-2"
                      >
                        <Link href={post.href}>Read More</Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-emerald-800 text-white border-none">
                      <p>Explore this article</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-4xl w-full text-center mt-12 z-10"
      >
        <p className="text-lg text-emerald-700 dark:text-emerald-300 mb-4">
          Ready to make a difference? Join Jeevanra and start your sustainability journey today.
        </p>
        <Button
          asChild
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300"
        >
          <Link href="/signup">Get Started</Link>
        </Button>
      </motion.div>
    </div>
  );
}