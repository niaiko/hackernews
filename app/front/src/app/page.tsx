"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, TrendingUp, Users, Clock, Zap, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { useAuth } from "@/contexts/auth-context"
import placeholder from "./placeholder.svg"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

// Fake stats data
const stats = [
  { icon: <TrendingUp className="h-8 w-8 text-primary" />, value: "10K+", label: "Stories" },
  { icon: <Users className="h-8 w-8 text-primary" />, value: "5K+", label: "Users" },
  { icon: <Clock className="h-8 w-8 text-primary" />, value: "24/7", label: "Updates" },
  { icon: <Zap className="h-8 w-8 text-primary" />, value: "100+", label: "Daily Posts" },
]

// Fake featured stories
const featuredStories = [
  {
    id: 1,
    title: "The Future of AI in Web Development",
    points: 423,
    author: "techguru",
    time: "3 hours ago",
    comments: 89,
  },
  {
    id: 2,
    title: "Why TypeScript is Taking Over Frontend Development",
    points: 387,
    author: "jsmaster",
    time: "5 hours ago",
    comments: 72,
  },
  {
    id: 3,
    title: "The Rise of Serverless Architecture",
    points: 352,
    author: "cloudexpert",
    time: "7 hours ago",
    comments: 64,
  },
]

// Fake testimonials
const testimonials = [
  {
    id: 1,
    text: "ModernHN has completely changed how I consume tech news. The interface is clean and the dark mode is easy on the eyes.",
    author: "Sarah J.",
    role: "Frontend Developer",
  },
  {
    id: 2,
    text: "I love the modern UI and animations. It makes browsing through stories a much more enjoyable experience.",
    author: "Michael T.",
    role: "UX Designer",
  },
  {
    id: 3,
    text: "The ability to save favorites and the user profiles feature makes this so much better than the original.",
    author: "Alex K.",
    role: "Software Engineer",
  },
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Set visibility for animations
    setIsVisible(true)

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <main className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-background to-background/80 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Modern Hacker News Experience
                </span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Stay Informed with <span className="text-primary">ModernHN</span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                Discover the best tech stories with a redesigned, eye-friendly experience. Modern UI, dark mode, and
                personalized features.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                <Button asChild size="lg" className="group">
                  <Link href="/stories">
                    Browse Stories
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" size="lg">
                    <Link href="/auth/register">Create Account</Link>
                  </Button>
                )}
              </motion.div>
            </div>

            <motion.div
              className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl hidden lg:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 z-10 rounded-lg"></div>
              <Image
                src={placeholder} 
                alt="ModernHN Interface"
                fill
                className="object-cover"
              />

              {/* Floating elements for visual interest */}
              <motion.div
                className="absolute top-10 right-10 h-16 w-16 rounded-full bg-primary/20 z-20"
                animate={{
                  y: [0, 15, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 4,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 left-10 h-12 w-12 rounded-full bg-primary/30 z-20"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 5,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Button
              variant="ghost"
              onClick={scrollToFeatures}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              Discover More
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} className="flex flex-col items-center text-center" variants={itemVariants}>
                <div className="mb-4 p-3 rounded-full bg-background shadow-md">{stat.icon}</div>
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Featured Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular tech stories trending right now
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {featuredStories.map((story, index) => (
              <motion.div key={story.id} variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <Card className="h-full overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        Trending #{index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 line-clamp-2">{story.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Icons.upvote className="h-3 w-3 mr-1 text-primary" />
                      <span className="font-medium mr-3">{story.points} points</span>
                      <span className="mr-3">by {story.author}</span>
                      <span>{story.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <Icons.messageCircle className="h-3 w-3 inline mr-1" />
                        {story.comments} comments
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="flex justify-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild variant="outline">
              <Link href="/stories" className="group">
                View All Stories
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose ModernHN?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We've reimagined the Hacker News experience with modern design and useful features
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="flex flex-col items-center text-center p-6" variants={itemVariants}>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icons.moon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dark Mode</h3>
              <p className="text-muted-foreground">
                Easy on the eyes with automatic dark mode support based on your system preferences.
              </p>
            </motion.div>

            <motion.div className="flex flex-col items-center text-center p-6" variants={itemVariants}>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icons.heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Favorites</h3>
              <p className="text-muted-foreground">
                Bookmark your favorite stories to read later and build your personal collection.
              </p>
            </motion.div>

            <motion.div className="flex flex-col items-center text-center p-6" variants={itemVariants}>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <Icons.users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">User Profiles</h3>
              <p className="text-muted-foreground">
                Create your profile, customize your experience, and connect with other users.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">What Users Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Hear from our community of tech enthusiasts</p>
          </motion.div>

          <motion.div
            className="relative max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative h-64 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{
                    opacity: currentTestimonial === index ? 1 : 0,
                    x: currentTestimonial === index ? 0 : 100,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-xl italic mb-6">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentTestimonial === index ? "bg-primary" : "bg-muted"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Upgrade Your Hacker News Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of tech enthusiasts who have already made the switch to ModernHN.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="group">
                <Link href="/stories">
                  Start Browsing
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/register">Create Free Account</Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}


// import { redirect } from "next/navigation"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"

// export default async function Home() {
//     try{
//         // redirect("/stories")
//         // const res = await fetch("http://BEALYBACK:8080/",  { cache: 'no-store' });
//         // const json = await res.json();
//         // console.log("====================================")
//         // console.log(json.message);
//         // console.log("====================================")
//         return (
//             <main className="container mx-auto px-4 py-8">
//               <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
//                 <div className="flex max-w-[980px] flex-col items-start gap-2">
//                   <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
//                     Welcome to Modern HackerNews
//                   </h1>
//                   <p className="max-w-[700px] text-lg text-muted-foreground">
//                     Discover the best tech stories with a redesigned, eye-friendly experience.
//                   </p>
//                 </div>
//                 <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
//                   <Button asChild>
//                     <Link href="/stories">Browse Stories</Link>
//                   </Button>
//                   <Button asChild variant="outline">
//                     <Link href="/profile">My Profile</Link>
//                   </Button>
//                 </div>
//               </section>
//             </main>
//           )
//     }
//     catch(e){console.log(e);return <div>Error</div>}

//     // return (
//     //     <div>
//     //         <img src="https://cdn.bealy.io/icons/bealyFavicon512.png" alt="Logo" width={50} height={50} />
//     //     </div>
//     // );
// }
