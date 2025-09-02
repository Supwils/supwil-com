'use client';

import { useEffect } from 'react';
import WelcomeCard from '@/components/Home/Welcome';
import AboutMeCard from '@/components/Home/AboutMe';
import ExprienceCard from '@/components/Home/Exprience';
import ContactCard from '@/components/Home/Contact';
import AnimatedSection from '@/components/UI/AnimatedSection';
import ViewCounter from '@/components/UI/ViewCounter';
import Ribbons from '@/components/UI/Ribbons';
export default function HomePage() {
    useEffect(() => {
        // Track page view when component mounts
        const trackPageView = async () => {
            try {
                const response = await fetch('/api/views', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ page: 'home' }),
                });
                
                if (!response.ok) {
                    console.warn('Failed to track page view');
                }
            } catch (error) {
                console.warn('Error tracking page view:', error);
            }
        };
        
        trackPageView();
    }, []);
    
    return (
        <div className="min-h-screen">
            <AnimatedSection direction="fade" duration={0.8}>
                <WelcomeCard />
            </AnimatedSection>

            <AnimatedSection direction="up" delay={0.2} duration={0.7}>
                <AboutMeCard />
            </AnimatedSection>

            <AnimatedSection direction="left" delay={0.1} duration={0.6}>
                <ExprienceCard />
            </AnimatedSection>

            <AnimatedSection direction="scale" delay={0.3} duration={0.8}>
                <ContactCard />
            </AnimatedSection>

           

<div style={{ height: '500px', position: 'relative', overflow: 'hidden'}}>
  <Ribbons
   className="h-full"
     baseThickness={30}
                    colors={['#5227FF']}
                    speedMultiplier={0.5}
                    maxAge={500}
                    enableFade={false}
                    enableShaderEffect={true}
                    effectAmplitude={2}
  />
</div>

            {/* <ViewCounter /> */}
        </div>
    )
}