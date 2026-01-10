"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, CheckCircle, Timer, BarChart3, Users, Zap, Github } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      duration: 1.2
    }
  }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              StudySync
            </span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="hidden sm:flex" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button className="rounded-full px-6" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 relative">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/20 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        </div>

        <section className="relative max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-10">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-8 max-w-5xl mx-auto"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-sm font-medium shadow-sm hover:shadow-md transition-all cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-300 dark:to-white">v1.0 is now live</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Your Academic Life, <br />
              <div className="relative inline-block mt-2">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 animate-gradient-x">
                  Perfectly Organized.
                </span>
                <span className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 opacity-20 blur-2xl -z-10" />
              </div>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              The student planner that actually works. Manage courses, track assignments, and boost your GPA with our all-in-one platform.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center pt-6">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all duration-300 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 border-0" asChild>
                <Link href="/register">
                  Sign Up <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg rounded-full backdrop-blur-md bg-white/50 dark:bg-black/50 border-slate-200 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:-translate-y-1 transition-all duration-300" asChild>
                <Link href="/login">
                  Log In
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1, type: "spring" }}
            className="relative mt-20 mx-auto max-w-6xl w-full perspective-2000"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2rem] opacity-20 blur-3xl -z-10" />

            <div className="relative rounded-[1.5rem] border border-slate-200/50 dark:border-slate-700/50 bg-slate-950/5 shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[21/9] ring-1 ring-white/10 backdrop-blur-sm">
              <Image
                src="/dashboard-preview.png"
                alt="Dashboard Preview"
                fill
                className="object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent pointer-events-none h-40 bottom-0" />
            </div>
          </motion.div>
        </section>

        {/* Features Bento Grid */}
        <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop juggling multiple apps. StudySync brings your calendar, notes, and habits together in one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Feature 1: Large Span */}
            <div className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-3xl bg-white dark:bg-slate-900 border p-8 flex flex-col justify-between overflow-hidden relative group hover:border-blue-500/50 transition-colors">
              <div className="z-10">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Smart Course Notes</h3>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Take notes with Markdown support directly linked to your courses. Use "/" commands to quickly add headers, lists, and code blocks.
                </p>
              </div>
              {/* Decorative Element */}
              <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border p-8 flex flex-col relative overflow-hidden group hover:border-green-500/50 transition-colors">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Task Tracking</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Kanban boards and lists to organize your assignments and exams.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border p-8 flex flex-col relative overflow-hidden group hover:border-orange-500/50 transition-colors">
              <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pomodoro Timer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Stay focused with customizable work/break intervals.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border p-8 flex flex-col relative overflow-hidden group hover:border-purple-500/50 transition-colors">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Grade Analytics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Visualize your GPA and academic performance over time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="col-span-1 md:col-span-2 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex flex-row items-center justify-between text-white relative overflow-hidden">
              <div className="z-10 max-w-lg">
                <h3 className="text-2xl font-bold mb-2">Sync Across Devices</h3>
                <p className="text-blue-100">
                  Your data is stored securely in the cloud. Access your planner from your laptop, tablet, or phone.
                </p>
              </div>
              <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t py-12 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-300">StudySync</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Features</Link>
            <Link href="#" className="hover:text-foreground">Pricing</Link>
            <Link href="#" className="hover:text-foreground">About</Link>
            <Link href="#" className="hover:text-foreground">Contact</Link>
          </div>
          <div className="flex gap-4 text-muted-foreground">
            <Link href="#" className="hover:text-foreground"><Github className="h-5 w-5" /></Link>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground mt-8">
          © 2024 StudySync. Open source student planner.
        </div>
      </footer>
    </div>
  );
}
