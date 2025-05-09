

import { Swiper, SwiperSlide } from 'swiper/react';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';



const Banner = () => {
    return (
        <div >
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper relative"
            >
                <SwiperSlide>
                    <img className='w-[100vw] h-[50vh] object-cover  ' src="https://i.ibb.co.com/NLJT1kC/done1.jpg" alt="" />
                    <div className='text-white absolute h-[75vh] w-[100vw] z-20 top-0 text-center bg-black bg-opacity-65 '>
                        <h1 className='mt-60 text-6xl font-bold'>Scholarship Application Deadline Alert</h1>
                        <p className='mt-6 text-2xl font-semibold w-[40%] mx-auto'>Hurry Up! Final Call to Apply for Scholarships at Top Universities – Application Deadline Approaching Fast!</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[50vh] object-cover  ' src="https://i.ibb.co.com/TvD0Gd9/done33.jpg" alt="" />
                    <div className='text-white absolute h-[75vh] w-[100vw] z-20 top-0 text-center bg-black bg-opacity-65'>
                        <h1 className='mt-60 text-6xl font-bold'> Early Bird Scholarship</h1>
                        <p className='mt-6 text-2xl font-semibold w-[40%] mx-auto'>Apply Now and Get an Early Bird Scholarship – Secure Your Spot Before It's Too Late!</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[50vh] object-cover  ' src="https://i.ibb.co.com/1zWmgdz/done4.jpg" alt="" />
                    <div className='text-white absolute h-[75vh] w-[100vw] z-20 top-0 text-center bg-black bg-opacity-65 '>
                        <h1 className='mt-60 text-6xl font-bold'>Exclusive Partner University Scholarships</h1>
                        <p className='mt-6 text-2xl font-semibold w-[40%] mx-auto'>Exclusive Scholarships Available – Partner Universities Offering Up to 50% Tuition Fee Waivers!</p>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <img className='w-[100vw] h-[50vh] object-cover  ' src="https://i.ibb.co.com/0snksLv/donn2.jpg" alt="" />
                    <div className='text-white absolute h-[75vh] w-[100vw] z-20 top-0 text-center bg-black bg-opacity-65 '>
                        <h1 className='mt-60 text-6xl font-bold'>Top Merit-Based Scholarships</h1>
                        <p className='mt-6 text-2xl font-semibold w-[40%] mx-auto'>Merit-Based Scholarships Available – Unlock Up to 100% Tuition Coverage for High Achievers!</p>
                    </div>
                </SwiperSlide>





            </Swiper>





        </div>
    )
}

Banner.propTypes = {}

export default Banner