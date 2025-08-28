"use client"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Toggle } from "@/components/ui/toggle"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    return (
      <Toggle
        aria-label="Toggle theme"
        className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out overflow-hidden
                   bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
                   shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <Sun
          className="absolute h-6 w-6 transition-all duration-300 ease-in-out
                     scale-100 rotate-0 opacity-100 text-black dark:text-white"
        />
      </Toggle>
    )
  }

  return (
    <Toggle
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ease-in-out overflow-hidden
                 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900
                 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                 data-[state=on]:bg-gradient-to-br data-[state=on]:from-blue-500 data-[state=on]:to-purple-600
                 data-[state=on]:text-white data-[state=off]:text-gray-700 dark:data-[state=off]:text-gray-300"
      pressed={theme === "dark"}
    >
      <Sun
        className="absolute h-6 w-6 transition-all duration-300 ease-in-out
                   scale-100 rotate-0 opacity-100 text-black dark:text-white
                   data-[state=on]:scale-0 data-[state=on]:rotate-90 data-[state=on]:opacity-0"
        data-state={theme === "light" ? "on" : "off"}
      />
      <Moon
        className="absolute h-6 w-6 transition-all duration-300 ease-in-out
                   scale-0 -rotate-90 opacity-0
                   data-[state=on]:scale-100 data-[state=on]:rotate-0 data-[state=on]:opacity-100"
        data-state={theme === "dark" ? "on" : "off"}
      />
    </Toggle>
  )
}
