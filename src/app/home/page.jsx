import WelcomeCard from '@/components/Home/WelcomeCard';
import AboutMeCard from '@/components/Home/AboutMeCard';
import ExprienceCard from '@/components/Home/ExprienceCard';
import ContactCard from '@/components/Home/ContactCard';
import AnimatedSection from '@/components/UI/AnimatedSection';

export default function HomePage() {
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
        </div>
    )
}