import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { useRef, useState, useEffect, useLayoutEffect } from "react"

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [headerOpacityValue, setHeaderOpacityValue] = useState(1)



  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Transform values based on scroll progress
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -100])
  
  // Update header opacity state when motion value changes
  useMotionValueEvent(headerOpacity, "change", (latest) => {
    setHeaderOpacityValue(latest)
  })

  // Initialize header opacity from current scroll on mount, before first paint
  useLayoutEffect(() => {
    setHeaderOpacityValue(headerOpacity.get())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Circle animation - grows upward and fills screen
  const circleScale = useTransform(scrollYProgress, [0.2, 0.8], [1, 3])
  const circleY = useTransform(scrollYProgress, [0.2, 0.8], [0, -400])
  
  // Second section animation
  const secondSectionOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1])
  const secondSectionY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0])

  // Section data
  const sections = [
    { title: "About Us", color: "#3B82F6", circleColor: "#0D703F" }, // Green
    { title: "Join Us", color: "#10B981", circleColor: "#315B7B" }, // Blue
    { title: "Support Us", color: "#8B5CF6", circleColor: "#C5441F" } // Red
  ]

  // Logo color state ensures cross-browser updates
  const [logoColor, setLogoColor] = useState<string>(sections[0].circleColor)
  useEffect(() => {
    setLogoColor(sections[activeSection].circleColor)
  }, [activeSection])

  const slides = [
    { 
      color: "transparent",
      title: "About Us",
      subtitle: "Learn about our mission to amplify youth voices and create meaningful change. We are a national, youth-powered movement dedicated to organizing bold campaigns and advancing real policy change.",
      buttonText: "Follow Us",
      image: "/src/assets/temp.webp"
    },
    { 
      color: "transparent",
      title: "Join Us",
      subtitle: "Ready to make a difference? Join our community of young advocates and become part of the movement. Together, we can build community and create lasting change.",
      buttonText: "Join Email List",
      image: "/src/assets/temp.webp"
    },
    { 
      color: "transparent",
      title: "Support Us",
      subtitle: "Help us amplify youth voices and advance our mission. Your support enables us to organize campaigns, advocate for policy change, and build stronger communities.",
      buttonText: "Support Now",
      image: "/src/assets/temp.webp"
    }
  ]

  const handleSectionClick = (index: number) => {
    setActiveSection(index)
    setCurrentSlide(index)
  }

  const handleDotClick = (index: number) => {
    setCurrentSlide(index)
    setActiveSection(index)
  }

  const handleNavClick = (sectionIndex: number) => {
    // Scroll to the second section (where the 3-part content is)
    const scrollTarget = window.innerHeight * 1.5 // Scroll further to fully reach the second section
    
    // Smooth scroll with custom duration
    const startPosition = window.pageYOffset
    const distance = scrollTarget - startPosition
    const duration = 1500 // 1.5 seconds for slower, smoother scroll
    let start: number | null = null

    const step = (timestamp: number) => {
      if (!start) start = timestamp
      const progress = timestamp - start
      const progressPercentage = Math.min(progress / duration, 1)
      
      // Easing function for smoother animation
      const easeInOutCubic = (t: number): number => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      
      const currentPosition = startPosition + distance * easeInOutCubic(progressPercentage)
      window.scrollTo(0, currentPosition)
      
      if (progress < duration) {
        requestAnimationFrame(step)
      }
    }
    
    requestAnimationFrame(step)
    
    // Set the active section
    setActiveSection(sectionIndex)
    setCurrentSlide(sectionIndex)
    
    // Close mobile menu if open
    setMobileMenuOpen(false)
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
      {/* Fixed Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-12"
        style={{ 
          opacity: headerOpacityValue
        }}
      >
        <div className="flex items-center">
          <svg 
            width="180" 
            height="21" 
            viewBox="0 0 494 55" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="transition-colors duration-500"
          >
            <path 
              d="M3.09219 17.68C3.09219 8.48 11.7322 2 24.0522 2C35.2522 2 41.4922 6.24 41.6522 11.76C41.7322 14.88 39.4122 16.96 35.2522 17.52C31.6522 18 28.2922 16.32 26.2122 12.96C23.7322 9.04 22.0522 6.48 20.5322 6.48C19.0922 6.48 18.2122 8.24 18.2122 11.44C18.2122 26.72 45.0122 20.48 45.0122 37.6C45.0122 47.68 35.4922 54.8 21.2522 54.8C8.69219 54.8 1.89219 51.84 1.17219 46.16C0.692188 42.16 3.33219 38.4 8.45219 38.4C12.6122 38.4 15.6522 40.32 19.0922 45.28C20.7722 47.76 22.0522 50.48 25.4922 50.48C28.0522 50.48 29.4922 48.64 29.4922 45.44C29.4922 34.24 3.09219 37.52 3.09219 17.68ZM60.9216 30.8C62.7616 35.44 67.2416 37.92 72.2016 37.92C75.8016 37.92 79.7216 36.56 83.1616 34C83.8016 33.52 84.2016 33.84 84.2016 34.8C84.2016 46.08 75.6416 54.8 65.1616 54.8C54.6016 54.8 47.4016 45.84 47.4016 34.08C47.4016 23.84 53.3216 13.12 65.2416 13.12C71.5616 13.12 76.6016 16.16 78.5216 20.64C80.6816 25.68 78.6816 29.92 72.7616 29.92H61.5616C61.0016 29.92 60.6816 30.24 60.9216 30.8ZM60.8416 26.96L65.9616 26.4C66.6016 26.32 66.9216 25.84 66.9216 25.28C66.9216 22.72 66.4416 15.92 62.7616 15.92C60.2016 15.92 59.0816 21.12 59.7216 26.16C59.8016 26.72 60.2816 27.04 60.8416 26.96ZM98.8903 30.8C100.73 35.44 105.21 37.92 110.17 37.92C113.77 37.92 117.69 36.56 121.13 34C121.77 33.52 122.17 33.84 122.17 34.8C122.17 46.08 113.61 54.8 103.13 54.8C92.5703 54.8 85.3703 45.84 85.3703 34.08C85.3703 23.84 91.2903 13.12 103.21 13.12C109.53 13.12 114.57 16.16 116.49 20.64C118.65 25.68 116.65 29.92 110.73 29.92H99.5303C98.9703 29.92 98.6503 30.24 98.8903 30.8ZM98.8103 26.96L103.93 26.4C104.57 26.32 104.89 25.84 104.89 25.28C104.89 22.72 104.41 15.92 100.73 15.92C98.1703 15.92 97.0503 21.12 97.6903 26.16C97.7703 26.72 98.2503 27.04 98.8103 26.96ZM141.819 20.24C144.859 16.8 149.259 13.36 153.259 13.36C159.179 13.36 161.739 16.88 162.219 22.4C163.099 31.68 163.419 36.88 164.379 46.16C164.539 47.44 164.699 48.16 164.939 49.44C165.499 52.64 163.019 54 160.619 54H152.139C149.739 54 147.019 52.56 147.019 49.44C147.019 47.36 147.819 46.16 147.819 44.08V30.4C147.819 25.68 146.859 23.68 144.699 23.76C142.459 23.92 140.939 25.44 140.939 27.68V44.08C140.939 45.52 141.979 48 141.979 49.44C141.979 52 139.659 54 136.619 54H129.259C126.219 54 123.899 52 123.899 49.44C123.899 48 124.939 45.52 124.939 44.08V25.44C124.939 23.76 123.819 21.68 123.819 19.76C123.819 16.96 125.739 15.2 128.539 14.72L137.099 13.28C139.339 12.88 140.939 13.76 140.939 15.76V19.84C140.939 20.72 141.259 20.88 141.819 20.24ZM207.71 21.36C203.31 19.52 200.67 16.8 200.19 13.6C199.07 6.48 207.15 2 220.99 2C232.75 2 239.39 5.2 239.23 10.8C239.15 14.8 235.23 16.96 231.15 16.96C228.11 16.96 224.99 15.68 223.39 13.04C221.23 9.44 221.07 5.52 219.07 5.52C216.99 5.52 215.47 7.6 215.63 11.92C215.79 16.72 220.27 20.16 222.99 21.04C223.79 21.28 224.59 21.92 224.35 22.72C224.19 23.6 223.47 24.16 222.59 24.32C213.07 26.72 209.39 31.44 209.71 38.32C210.03 46.4 215.79 51.36 225.55 51.36C240.99 51.36 246.43 38.32 239.71 26.48C239.39 25.92 238.59 25.68 237.95 26.08C234.59 28 231.71 30.32 230.51 33.04C230.27 33.6 230.43 34.32 231.07 34.88C235.07 38.4 231.55 45.2 225.87 45.2C220.99 45.2 217.79 42.16 218.03 37.68C218.59 27.36 241.39 21.28 248.99 14.48C249.55 14 249.39 13.6 248.67 13.44C245.87 12.88 243.95 10.8 243.95 7.92C243.95 4.72 246.91 2.24 250.67 2.24C254.83 2.24 257.39 4.32 257.71 7.92C258.03 11.52 256.11 14.56 253.71 17.12C252.03 18.88 249.15 20.48 245.95 22.08C244.03 23.04 244.11 23.52 246.35 23.68C252.03 24.08 260.03 26.56 260.43 34.08C261.07 45.68 244.43 54.8 224.19 54.8C202.83 54.8 189.55 48.8 188.75 39.04C188.11 30.64 195.63 23.84 207.47 22.96C209.63 22.8 209.71 22.24 207.71 21.36ZM302.93 34.8V44.08C302.93 45.52 303.97 48 303.97 49.44C303.97 52 301.65 54 298.61 54H290.45C287.41 54 285.09 52 285.09 49.44C285.09 48 286.13 45.52 286.13 44.08V12.72C286.13 11.28 285.09 8.8 285.09 7.36C285.09 4.8 287.41 2.8 290.45 2.8H298.61C301.65 2.8 303.97 4.8 303.97 7.36C303.97 8.8 302.93 11.28 302.93 12.72V23.44C302.93 24.24 303.41 24.72 304.21 24.72H313.57C314.37 24.72 314.85 24.24 314.85 23.44V12.72C314.85 11.28 313.81 8.8 313.81 7.36C313.81 4.8 316.13 2.8 319.17 2.8H327.33C330.37 2.8 332.69 4.8 332.69 7.36C332.69 8.8 331.65 11.28 331.65 12.72V44.08C331.65 45.52 332.69 48 332.69 49.44C332.69 52 330.37 54 327.33 54H319.17C316.13 54 313.81 52 313.81 49.44C313.81 48 314.85 45.52 314.85 44.08V34.8C314.85 34 314.37 33.52 313.57 33.52H304.21C303.41 33.52 302.93 34 302.93 34.8ZM349.203 30.8C351.043 35.44 355.523 37.92 360.483 37.92C364.083 37.92 368.003 36.56 371.443 34C372.083 33.52 372.483 33.84 372.483 34.8C372.483 46.08 363.923 54.8 353.443 54.8C342.883 54.8 335.683 45.84 335.683 34.08C335.683 23.84 341.603 13.12 353.523 13.12C359.843 13.12 364.883 16.16 366.803 20.64C368.963 25.68 366.963 29.92 361.043 29.92H349.843C349.283 29.92 348.963 30.24 349.203 30.8ZM349.123 26.96L354.243 26.4C354.883 26.32 355.203 25.84 355.203 25.28C355.203 22.72 354.723 15.92 351.043 15.92C348.483 15.92 347.363 21.12 348.003 26.16C348.083 26.72 348.563 27.04 349.123 26.96ZM398.212 51.04C395.572 53.92 391.892 54.8 387.172 54.8C379.492 54.8 373.652 50.24 373.652 43.84C373.652 36.96 379.732 33.12 388.612 33.12C390.212 33.12 392.772 33.28 394.932 33.44C395.492 33.52 395.812 33.12 395.732 32.56L394.052 22.32C393.172 17.04 392.212 15.92 390.692 16.48C387.172 17.76 392.852 28.56 384.532 30.8C383.732 31.04 382.932 31.12 382.292 31.12C376.292 31.12 373.972 23.84 377.892 18.64C381.412 14 387.732 13.36 393.412 13.36C402.532 13.36 409.092 17.92 410.372 25.28L413.972 46C414.372 48.4 416.292 54 411.972 54H405.492C402.292 54 400.372 52.72 399.332 51.2C399.012 50.72 398.612 50.64 398.212 51.04ZM396.532 37.68C396.372 36.32 394.692 36.16 393.572 36.16C391.572 36.16 389.252 38.16 389.972 43.76C390.612 48.96 392.692 50.88 395.012 50.32C396.372 50 397.972 48.32 397.572 43.68L396.532 37.68ZM434.626 27.36C434.786 17.68 437.746 13.2 443.666 13.2C447.906 13.2 449.586 16.56 449.826 20.32C450.386 30.08 440.866 30.32 433.986 31.36V44.08C433.986 45.52 435.026 48 435.026 49.44C435.026 52 432.706 54 429.666 54H422.306C419.266 54 416.946 52 416.946 49.44C416.946 48 417.986 45.52 417.986 44.08V25.44C417.986 23.76 416.866 21.68 416.866 19.76C416.866 16.96 418.786 15.2 421.586 14.72L428.146 13.6C432.066 12.96 433.986 14.8 433.986 19.36V27.28C433.986 28 434.626 28.08 434.626 27.36ZM478.683 51.76C476.523 53.92 473.403 54.8 469.083 54.8C458.123 54.8 450.683 46.32 450.683 34C450.683 20.64 458.443 13.2 469.243 13.2C472.203 13.2 474.523 13.76 476.283 14.88C476.763 15.2 477.083 15.04 477.083 14.48V12.88C477.083 11.2 475.963 9.12 475.963 7.2C475.963 4.4 477.883 2.64 480.683 2.16L489.243 0.719999C491.483 0.32 493.083 1.2 493.083 3.2V49.6C493.083 52.4 490.763 54 486.763 54C484.523 54 481.883 53.6 479.963 51.76C479.563 51.36 479.083 51.36 478.683 51.76ZM477.083 26.24C476.363 19.28 474.123 15.68 471.483 15.92C468.283 16.16 467.003 22.64 467.803 34.32C468.603 46.4 469.963 51.36 473.403 51.2C475.323 51.04 476.683 46.8 477.083 39.12V26.24Z" 
              fill={logoColor}
            />
          </svg>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Button variant="link" onClick={() => handleNavClick(0)} className="text-gray-800 hover:text-black font-medium text-lg p-0 h-auto">
            About Us
          </Button>
          <Button variant="link" onClick={() => handleNavClick(1)} className="text-gray-800 hover:text-black font-medium text-lg p-0 h-auto">
            Join Us
          </Button>
          <Button variant="link" onClick={() => handleNavClick(2)} className="text-gray-800 hover:text-black font-medium text-lg p-0 h-auto">
            Support Us
          </Button>
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center space-x-6">
          <Button className="bg-black hover:bg-gray-800 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-md font-medium text-sm sm:text-base">
            Get Involved
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 border-t border-gray-200 md:hidden"
            style={{ backgroundColor: '#EEEFE8' }}
          >
            <nav className="flex flex-col p-4 space-y-4">
              <Button variant="link" onClick={() => handleNavClick(0)} className="text-gray-800 hover:text-black font-medium text-lg py-2 text-left p-0 h-auto justify-start">
                About Us
              </Button>
              <Button variant="link" onClick={() => handleNavClick(1)} className="text-gray-800 hover:text-black font-medium text-lg py-2 text-left p-0 h-auto justify-start">
                Join Us
              </Button>
              <Button variant="link" onClick={() => handleNavClick(2)} className="text-gray-800 hover:text-black font-medium text-lg py-2 text-left p-0 h-auto justify-start">
                Support Us
              </Button>
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md font-medium mt-2">
                Get Started
              </Button>
            </nav>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <motion.div 
        className="fixed inset-0 px-4 sm:px-6 lg:px-12 pt-20 sm:pt-24 lg:pt-32"
        style={{ 
          opacity: heroOpacity,
          y: heroY
        }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Main Headline */}
          <div className="text-center space-y-4 sm:space-y-6">
            {/* First Line */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              <h1 className="font-black text-black tracking-tight">ORGANIZE</h1>
              <h1 className="font-black text-black tracking-tight">ADVOCATE</h1>
            </div>

            {/* Second Line */}
            <div className="flex items-center justify-center text-4xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
              <h1 className="font-black text-black tracking-tight">UNIFY</h1>
            </div>
          </div>

          {/* Subheading */}
          <div className="text-center mt-4 sm:mt-6 lg:mt-8 max-w-3xl mx-auto px-4">
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-800 font-medium leading-relaxed">
              A national, youth-powered movement to organize bold campaigns, advance real policy change, build community and unify the voices of the many groups that advocate on behalf of children
            </p>
          </div>
        </div>
      </motion.div>

      {/* Animated Circle - Dynamic Color */}
      <motion.div 
        className="fixed left-1/2 w-[200vw] sm:w-[150vw] h-[200vw] sm:h-[150vw] max-w-[1500px] max-h-[1500px] rounded-full origin-center transition-colors duration-500"
        style={{ 
          backgroundColor: sections[activeSection].circleColor,
          x: '-50%',
          top: '55vh',
          scale: circleScale,
          y: circleY
        }}
      />

      {/* Second Section with Navigation and Sliding Squares */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-40 pt-16 sm:pt-20 pb-8 sm:pb-16 overflow-y-auto lg:overflow-y-hidden"
        style={{ 
          opacity: secondSectionOpacity,
          y: secondSectionY
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 min-h-full flex flex-col justify-center">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-4 sm:mb-6 flex-shrink-0">
            {sections.map((section, index) => (
              <button
                key={index}
                onClick={() => handleSectionClick(index)}
                className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeSection === index
                    ? 'bg-black text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Content Container - No Horizontal Scrolling */}
          <div className="relative flex-1 min-h-[500px] lg:max-h-[500px] overflow-hidden">
            <div className="w-full h-full">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 w-full h-full rounded-lg flex items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ backgroundColor: slide.color }}
                >
                  <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl mx-auto space-y-6 lg:space-y-0 lg:space-x-8">
                    {/* Image Section */}
                    <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center">
                      <div className="relative w-full max-w-sm lg:max-w-none">
                        <img 
                          src={slide.image} 
                          alt={slide.title}
                          className="w-full h-auto max-h-[200px] sm:max-h-[250px] lg:max-h-[350px] object-contain rounded-lg"
                        />
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center">
                      <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 w-full max-w-md lg:max-w-none">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight drop-shadow-lg">
                          {slide.title}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg text-white/95 mb-4 sm:mb-6 leading-relaxed drop-shadow-md">
                          {slide.subtitle}
                        </p>
                        <Button className="bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold shadow-lg text-sm sm:text-base">
                          {slide.buttonText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-3 sm:mt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-black'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating "Grow with us" element at bottom */}
      <motion.div 
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        style={{ 
          opacity: headerOpacity, // Fades out with header as user scrolls
        }}
      >
        {/* Rounded rectangle with text */}
        <div className="rounded-full px-6 py-3 shadow-lg bg-white">
          <span className="text-sm font-medium text-gray-800 tracking-wide">
            FIND OUT MORE
          </span>
        </div>
        
        {/* Dashed line extending down */}
        <div 
          className="w-0.5 mx-auto mt-2"
          style={{
            height: '60px',
            borderLeft: '2px dashed white',
          }}
        />
      </motion.div>

      {/* Spacer for scroll */}
      <div className="h-screen" />
      <div className="h-screen" />
      <div className="h-screen" />
    </div>
  )
}
