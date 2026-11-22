/**
 * Real reviews from the Shark Driving School Google Business Profile (formerly 1-2 Drive),
 * copied word for word on 22 Nov 2026. Newest first. Dates are the month Google showed
 * ("3 weeks ago" etc. on that day).
 *
 * `photo` is the reviewer's public Google profile picture, loaded from Google (if it fails
 * to load, the card shows the reviewer's initial). `passPhoto` is the pass photo they posted
 * with their review, saved in public/images/passes/ (see data/passes.ts).
 *
 * Not shown: one 5-star rating with no written review, and one review that names
 * another driving school (it would confuse new visitors).
 *
 * To add new reviews: copy them from Google, newest at the top, and update
 * `googleRating` / `googleReviewCount` in config/site.ts.
 */

import type { PassSlug } from './passes';

export interface Review {
  name: string;
  /** Public Google profile picture URL, or omit to show the initial. */
  photo?: string;
  /** Month the review was posted, e.g. "Nov 2026". */
  date: string;
  text: string;
  /** Optional short highlight, e.g. "Passed first time". */
  tag?: string;
  /** Pass photo posted with the review: a slug in data/passes.ts. */
  passPhoto?: PassSlug;
  rating: 1 | 2 | 3 | 4 | 5;
}

const avatar = (id: string) => `https://lh3.googleusercontent.com/${id}=s128-c`;

export const reviews: Review[] = [
  {
    name: 'Jennifer',
    photo: avatar('a/ACg8ocKIkdaETLcioX3ktDkF-2CZnriH6RKPZj30AHae81lm6c33Gw'),
    date: 'Nov 2026',
    tag: 'Passed first time',
    rating: 5,
    text: 'After trying a few different instructors, I found Ayesha and stuck with her until I passed my test as she was so patient and an excellent driving instructor. Wouldn’t recommend anyone else! She was the reason I passed 1st time :)',
  },
  {
    name: 'Olaniyi Alli',
    passPhoto: 'olaniyi',
    photo: avatar('a-/ALV-UjUJOT1r2E4Fy5CK-EYP0oOCfQQgjmtpvhJp2OwKh3RnvpclqBer'),
    date: 'Nov 2026',
    tag: 'Passed',
    rating: 5,
    text: "I highly recommend Shark Driving School! The instructor was patient, professional and supportive throughout my lessons. The guidance and preparation gave me the confidence I needed to pass my driving test. I'm truly grateful for the excellent service and would happily recommend them to others!",
  },
  {
    name: 'Jessica Brett',
    photo: avatar('a/ACg8ocIpJ1E3p4lm_EUwu55vg_4LJVLrMG005Sff1OR85D7yCHRwLOs'),
    date: 'Nov 2026',
    tag: 'Passed first time',
    rating: 5,
    text: 'I passed my test today on my first attempt thanks to my instructor Ayesha. I started lessons as a very anxious driver who hadn’t had any prior learning and Ayesha has helped and supported me through it all. She always stays calm despite me panicking and stressing over everything, she has continued to reassure me on the progress being made. She has helped me master the parallel park which I once thought was impossible😂 I couldn’t have asked for a more supportive instructor.\nI will miss our drives and chats, thank you so much for everything ☺️',
  },
  {
    name: 'Popoola Adebayo',
    passPhoto: 'popoola',
    photo: avatar('a-/ALV-UjXMledU-u_3SZsan5xKPy47S2ULOE3OR_tiNt-KKzosKDezOqE'),
    date: 'Oct 2026',
    rating: 5,
    text: "My instructor Ayeeshaaa is simply the best. She's an excellent instructor. She teaches calmly, accurately and professionally. She's been a wonderful person. Thank you my instructor.",
  },
  {
    name: 'Monira Adam',
    photo: avatar('a/ACg8ocLfh7sVfHtrZWUJx5rKtjuTTO9t7OUvG0lb2zzTxU7ELrwYOg'),
    date: 'Oct 2026',
    tag: 'Passed first time',
    rating: 5,
    text: 'I passed on my first go with just only 24hrs of lessons. My instructor explained things really well and thought me how to drive safely. My instructor really boosted my driving skills and confidence, if it wasn’t for them I would have failed. Thank you !!☺️',
  },
  {
    name: 'Ibris Dumitru',
    photo: avatar('a/ACg8ocIIM1Js9piEUHhxZuIEz3TJsf-mMJpxelm7uib1WTbPr7Avxw'),
    date: 'Oct 2026',
    rating: 5,
    text: 'The instructor is excellent; I like how she explains everything, and she helped me understand it all. I want to thank her—you can reach out to her with full confidence. ✌️😀😘🙏',
  },
  {
    name: 'Celeste De Brito',
    photo: avatar('a/ACg8ocKzRrnJldG3D3VeDKF7yZHf7XYkWmKVsnAYJGd50UzPK3Dj8A'),
    date: 'Oct 2026',
    rating: 5,
    text: 'Thank you very much 1-2 drive and a very big thank you to my instructor Aisha.',
  },
  {
    name: 'Ali Rehan',
    passPhoto: 'ali',
    photo: avatar('a/ACg8ocKN4QolG7ko9XpPM5BNYx9KX5ZYKAjWQvAg5f-KK3wkojISJg'),
    date: 'Sep 2026',
    rating: 5,
    text: 'Amazing driving instructor!\nAdnan Bhai was really supportive and clear with his guidance. Would definitely recommend',
  },
  {
    name: 'Pui-san Fong',
    passPhoto: 'pui-san',
    photo: avatar('a/ACg8ocJqW9keQlcVmMNeeYcFyDJ-L3EvzbGwqeV8IwtCrKzA555Rqw'),
    date: 'Jul 2026',
    tag: 'Passed first time · Automatic',
    rating: 5,
    text: 'I would like to say a very big Thank you to Ms Aisha, who made me confident , competent driver , believed in me to pass driving. I had many failed attempts with Manual previously but passed first time with Ms Aisha with automactic.\n\nShe is a very calm ,fair , firm teacher and I believe she will help many other students to feel calm and be test ready like I was.\n\nI always manifested and believed myself I will pass one day .I eventually passed today, with my test at 12:28.\n\nThank you so much and made one of my dreams come true today!! I’m officially a driver and can drive safely and can put my baby in my car. Alot of sense of relief , I can do it, many other students can pass too, only if you believe in yourself!!!',
  },
  {
    name: 'Jemma Molloy',
    passPhoto: 'jemma',
    photo: avatar('a/ACg8ocKbvI7E9Wezm2WH_-7QQFbSfJEc86FRsEEjfVx-vbah9C-7Rw'),
    date: 'Jul 2026',
    tag: 'Passed',
    rating: 5,
    text: 'Passed my driving test today and it is all thanks to Ayesha, she was so patient, calm and clear when giving instructions. I always felt at ease when driving with her, if you are looking for an amazing instructor and to pass I would 100% recommend using 1-2 driving.',
  },
  {
    name: 'Estelle J',
    photo: avatar('a-/ALV-UjUtspIsyVIjy7_zMPrD0iMncDSDnHBS3nLEkFGyd09ZgsSbaxXw'),
    date: 'Jul 2026',
    rating: 5,
    text: 'I had a fantastic experience learning with Jurate. They are incredibly patient, calm, and highly skilled at teaching. Every lesson was well explained, and they always took the time to make sure I understood everything and felt confident behind the wheel. Their supportive and encouraging approach made learning to drive much less stressful and much more enjoyable. I would highly recommend them to anyone looking for a professional, friendly, and excellent driving instructor! 😊🙌🏻',
  },
  {
    name: 'Jordan Dingwall',
    passPhoto: 'jordan',
    photo: avatar('a/ACg8ocLC68HJ_BnfjQZBREs_M14S-WfcmSqfq8wP0ZadBTiZcZbWlA'),
    date: 'Jun 2026',
    tag: 'Passed first time',
    rating: 5,
    text: 'Two of the best instructors, wouldn’t have passed first time without them.',
  },
  {
    name: 'Mahim K',
    photo: avatar('a/ACg8ocLiRX_DKRUkuyNXQu6_hn9sNxbFMOqKfRmkhiobh3Y9-VX6vA'),
    date: 'Jun 2026',
    tag: 'Passed',
    rating: 5,
    text: 'My experiance was very nice with Ayesha\nShe was very good with teaching building confident.\n\nShe teached me everything and make me ready for the test and today i passed.\n\nHad a very good good experiance with Ayesha it was lovely learning from her. I am very glad that i learnt from her',
  },
  {
    name: 'Edvinas Jomantas',
    photo: avatar('a/ACg8ocI5eAqn-BNHyBdEa8MLCPuH0_a7BFV14Zla-NC1_ZjrCnYOow'),
    date: 'May 2026',
    rating: 5,
    text: 'She is a great instructor who explains things clearly and makes learning much easier. She is patient, supportive, and always willing to help when someone doesn’t understand something. Her classes are well organised and enjoyable, and she creates a really positive learning environment. I’ve learned a lot from her and really appreciate the effort she puts into teaching.',
  },
  {
    name: 'Kelsey Mincher',
    photo: avatar('a/ACg8ocJeEKsi76pakLKcCiVTYxQQCuVmz283y3s66PURGPVpf7f3RQ'),
    date: 'May 2026',
    tag: 'Passed',
    rating: 5,
    text: 'I worked and passed my test with Ayesha. After a previous bad experience I started working with Ayesha and she was amazing. She was so supportive and listened to the areas I felt less confident in!',
  },
  {
    name: 'Ismail',
    photo: avatar('a/ACg8ocJX4XR5cbAeErRdrEZpVvzL7ueps-Ye3nUXMD2rdJOm2U8wpis'),
    date: 'May 2026',
    rating: 5,
    text: 'Very patient and kind instructor. Would definitely recommend! 💯',
  },
];
