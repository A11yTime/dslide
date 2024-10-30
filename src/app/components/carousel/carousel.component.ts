import { Component, OnInit, OnDestroy, QueryList, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('slide') slides!: QueryList<ElementRef<HTMLDivElement>>;
  dots: HTMLElement[] = [];
  
  images = [
    { src: 'Images/image1.jpg', alt: 'Description of Image 1' },
    { src: 'Images/image2.jpg', alt: 'Description of Image 2' },
    { src: 'Images/image3.jpg', alt: 'Description of Image 3' },
    { src: 'Images/image4.jpg', alt: 'Description of Image 4' },
    { src: 'Images/image5.jpg', alt: 'Description of Image 5' },
  ];

  slideIndex = 1; // Start from the first slide
  intervalId: any;
  isPlaying = true; // Property to track play/pause state
  ariaLive = 'off'; // Initial aria-live state 

  ngOnInit(): void {
    this.startAutoRotation(); // Start auto-rotation when initialized
  }

  ngAfterViewInit(): void {
    this.dots = Array.from(document.getElementsByClassName("dot")) as HTMLElement[]; // Initialize dots here
    this.showSlides(); // Call showSlides after the view is initialized
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Clear the interval when the component is destroyed
  }

  startAutoRotation(): void {
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.nextSlide(); // Automatically go to the next slide
      }
    }, 2000); // Change slide every 3 seconds (3000 ms)
  }

  showSlides(): void {
    if (this.slides.length > 0) {
      this.slides.forEach((slide) => (slide.nativeElement.style.display = 'none')); // Hide all slides
      if (this.slideIndex > this.images.length) {
        this.slideIndex = 1; // Loop back to first slide
      }
      if (this.slideIndex < 1) {
        this.slideIndex = this.images.length; // Loop back to last slide
      }

      this.dots.forEach(dot => dot.className = dot.className.replace(" active", "")); // Remove active class
      this.slides.toArray()[this.slideIndex - 1].nativeElement.style.display = 'block'; // Show current slide
      this.dots[this.slideIndex - 1].className += " active"; // Set current dot as active
    }
  }

  nextSlide(): void {
    this.slideIndex++;
    this.showSlides(); // Update the displayed slide
  }

  previousSlide(): void {
    this.slideIndex--;
    this.showSlides(); // Update the displayed slide
  }

  isFirstSlide(): boolean {
    return this.slideIndex === 1; // Check if it's the first slide
  }

  isLastSlide(): boolean {
    return this.slideIndex === this.images.length; // Check if it's the last slide
  }

  currentSlide(n: number): void {
    clearTimeout(this.intervalId); // Clear the timeout to avoid overlapping calls
    this.slideIndex = n; // Set the slide index to the clicked dot
    this.showSlides(); // Show the selected slide
    this.ariaLive = 'polite'; // Set aria-live to polite for manual navigation
  }

  togglePlayPause(): void {
    this.isPlaying = !this.isPlaying; // Toggle the play/pause state
    if (this.isPlaying) {
      this.startAutoRotation(); // Resume the slideshow
      this.showSlides(); // Show the current slide
      this.ariaLive = 'off'; // Ensure aria-live is off when playing
    } else {
      clearInterval(this.intervalId); // Pause the slideshow
      this.ariaLive = 'off'; // Ensure aria-live is off when paused
    }
  }

  onDotKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Enter' || event.key === ' ') { // Handle Enter and Space keys
      this.currentSlide(index); // Navigate to the corresponding slide
      event.preventDefault(); // Prevent default action
    }
  }
  pauseSlideshow(): void {
    clearTimeout(this.intervalId); // Stop the automatic slide change
    this.isPlaying = false; // Update the play state
  }
  
  resumeSlideshow(): void {
    if (!this.isPlaying) {
      this.showSlides();
      // this.startAutoRotation(); // Resume the slideshow if it was paused
      this.isPlaying = true; // Update the play state
    }
  }
}
