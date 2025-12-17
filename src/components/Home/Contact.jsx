"use client";

import { useState } from "react";
import emailjs from "emailjs-com";

export default function ContactCard() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        emailSubject: "",
        message: "",
    });

    const [validationMessage, setValidationMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // "success" or "error"
    const [errors, setErrors] = useState({
        fullName: false,
        email: false,
        message: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error state when user types in a field
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: false
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { fullName, email, message } = formData;
        let hasErrors = false;
        const newErrors = {
            fullName: false,
            email: false,
            message: false
        };

        // Validate required fields
        if (!fullName) {
            newErrors.fullName = true;
            hasErrors = true;
        }

        if (!email) {
            newErrors.email = true;
            hasErrors = true;
        }

        if (!message) {
            newErrors.message = true;
            hasErrors = true;
        }

        setErrors(newErrors);

        if (hasErrors) {
            // Apply shake animation and return early
            setTimeout(() => {
                setErrors({
                    fullName: false,
                    email: false,
                    message: false
                });
            }, 2000);
            return;
        }

        // If validation passes, send the email
        setValidationMessage("");
        // Send email using EmailJS
        emailjs
            .send(
                "service_86jznw1",
                "template_jkvirwl",
                formData,
                "XT0i9ln5UAkdi5Th3"
            )
            .then(
                (response) => {
                    setValidationMessage("Message sent successfully!");
                    setMessageType("success");

                    // Reset form
                    setFormData({
                        fullName: "",
                        email: "",
                        mobileNumber: "",
                        emailSubject: "",
                        message: "",
                    });

                    setTimeout(() => {
                        setValidationMessage("");
                        setMessageType("");
                    }, 3000);
                },
                (err) => {
                    setValidationMessage(
                        "Failed to send message. Please try again later."
                    );
                    setMessageType("error");

                    setTimeout(() => {
                        setValidationMessage("");
                        setMessageType("");
                    }, 3000);
                }
            );
    };

    return (
        <div className='relative flex justify-center items-center px-[3%] pb-0'>
            <section
                id="contact"
                className="container flex flex-col justify-center items-start text-left bg-[var(--background)] rounded-2xl py-[8rem] relative z-10 max-md:py-12 max-md:mt-12"
            >
                {/* Contact Title */}
                <div className='w-full mb-12'>
                    <h2 className='text-[var(--text-color)] text-2xl md:text-3xl lg:text-4xl font-bold font-mono mb-8'>
                        Contact <span className='text-[var(--main-color)]'>Me!</span>
                    </h2>
                </div>

                {/* Contact Form */}
                <div className='w-full'>
                    <form onSubmit={handleSubmit} className='w-full'>
                        {/* First Row - Name and Email */}
                        <div className='flex gap-4 mb-6 max-md:flex-col'>
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Name*"
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`flex-1 p-4 text-base md:text-lg text-[var(--text-color)] bg-[var(--background)]  border border-[var(--border-color)] rounded-lg transition-all duration-300 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)] focus:ring-opacity-20 ${errors.fullName ? 'border-red-500 animate-pulse' : ''
                                    }`}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email*"
                                value={formData.email}
                                onChange={handleChange}
                                className={`flex-1 p-4 text-base md:text-lg text-[var(--text-color)] bg-[var(--background)] border border-[var(--border-color)] rounded-lg transition-all duration-300 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)] focus:ring-opacity-20 ${errors.email ? 'border-red-500 animate-pulse' : ''
                                    }`}
                            />
                        </div>

                        {/* Second Row - Phone and Subject */}
                        <div className='flex gap-4 mb-6 max-md:flex-col'>
                            <input
                                type="tel"
                                name="mobileNumber"
                                placeholder="Phone Number"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className='flex-1 p-4 text-base md:text-lg text-[var(--text-color)] bg-[var(--background)]  border border-[var(--border-color)] rounded-lg transition-all duration-300 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)] focus:ring-opacity-20'
                            />
                            <input
                                type="text"
                                name="emailSubject"
                                placeholder="Subject"
                                value={formData.emailSubject}
                                onChange={handleChange}
                                className='flex-1 p-4 text-base md:text-lg text-[var(--text-color)] bg-[var(--background)] border border-[var(--border-color)] rounded-lg transition-all duration-300 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)] focus:ring-opacity-20'
                            />
                        </div>

                        {/* Message Textarea */}
                        <div className='mb-6'>
                            <textarea
                                name="message"
                                rows="6"
                                placeholder="Your Message*"
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full p-4 text-base md:text-lg text-[var(--text-color)] bg-[var(--background)] border border-[var(--border-color)] rounded-lg resize-none transition-all duration-300 focus:outline-none focus:border-[var(--main-color)] focus:ring-2 focus:ring-[var(--main-color)] focus:ring-opacity-20 ${errors.message ? 'border-red-500 animate-pulse' : ''
                                    }`}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className='flex flex-col items-start'>
                            <button
                                type="submit"
                                className='px-8 py-4 bg-[var(--main-color)] text-white rounded-lg text-base md:text-lg font-semibold transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg hover:shadow-[var(--main-color)]/2 focus:outline-none focus:ring-1 focus:ring-[var(--main-color)] focus:ring-opacity-30'
                            >
                                Send Message
                            </button>

                            {/* Validation Message */}
                            {validationMessage && (
                                <div className={`mt-4 p-3 rounded-lg text-sm md:text-base font-medium transition-all duration-300 ${messageType === "success"
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                    }`}>
                                    {validationMessage}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}
