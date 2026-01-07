import { Activity, Bone, HeartPulse, Stethoscope, LucideIcon } from 'lucide-react';

export interface Service {
    slug: string;
    title: string;
    shortDesc: string;
    fullDesc: string;
    benefits: string[];
    icon: LucideIcon;
}

export const services: Service[] = [
    {
        slug: 'knee-replacement',
        title: 'Total Knee Replacement',
        shortDesc: 'Advanced minimal-incision technique for rapid recovery and pain relief.',
        fullDesc: `
      <p>Total Knee Replacement (TKR) is a surgical procedure to replace the weight-bearing surfaces of the knee joint to relieve pain and disability. It is most commonly performed for osteoarthritis, and also for other knee diseases such as rheumatoid arthritis and psoriatic arthritis.</p>
      <p>At Joint Care, Dr. Rakesh Patil uses the latest minimal-incision techniques. This approach spares the quadriceps muscle, leading to significantly less pain, less blood loss, and a much faster return to walking and daily activities.</p>
    `,
        benefits: [
            'Minimal Incision Technique',
            'Rapid Recovery Protocol',
            'Computer-Assisted Navigation',
            'High-Flexion Implants'
        ],
        icon: Bone
    },
    {
        slug: 'arthritis-care',
        title: 'Arthritis Care',
        shortDesc: 'Comprehensive non-surgical and surgical management of joint pain.',
        fullDesc: `
      <p>Arthritis is not a single disease; it is an informal way of referring to joint pain or joint disease. There are more than 100 different types of arthritis and related conditions. Common symptoms include swelling, pain, stiffness and decreased range of motion.</p>
      <p>Our approach minimizes the need for surgery. We focus on early diagnosis, lifestyle modification, physiotherapy, and advanced medication management to keep your natural joints healthy for as long as possible.</p>
    `,
        benefits: [
            'Early Diagnosis & Prevention',
            'Lifestyle & Diet Counseling',
            'Advanced Pain Management',
            'Joint Preservation Therapy'
        ],
        icon: Activity
    },
    {
        slug: 'sports-injury',
        title: 'Sports Injury',
        shortDesc: 'Expert treatment for ligament tears, meniscus injuries, and fractures.',
        fullDesc: `
      <p>Sports injuries occur during exercise or while participating in a sport. Children are particularly at risk for these types of injuries, but adults can get them, too. You’re at risk for sports injuries if you haven’t been active regularly, don’t warm up properly before exercise, or play contact sports.</p>
      <p>We provide specialized care for ACL/PCL tears, meniscus injuries, and cartilage damage through advanced arthroscopic (keyhole) surgery, ensuring athletes get back to their peak performance safely.</p>
    `,
        benefits: [
            'Arthroscopic (Keyhole) Surgery',
            'ACL & PCL Reconstruction',
            'Meniscus Repair',
            'Sports Rehabilitation Program'
        ],
        icon: HeartPulse
    },
    {
        slug: 'fracture-management',
        title: 'Fracture Management',
        shortDesc: '24/7 trauma care and advanced fixation for complex fractures.',
        fullDesc: `
      <p>A bone fracture is a medical condition where the continuity of the bone is broken. A significant percentage of bone fractures occur because of high force impact or stress. However, a fracture may also be the result of some medical conditions that weaken the bones, for example osteoporosis.</p>
      <p>We specialize in the management of complex trauma and neglected fractures. Using modern locking plate technology and nailing systems, we ensure stable fixation that allows for early mobilization and healing.</p>
    `,
        benefits: [
            '24/7 Trauma Care',
            'Minimally Invasive Plating',
            'Complex Trauma Management',
            'Geriatric Fracture Care'
        ],
        icon: Stethoscope
    },
    {
        slug: 'total-hip-replacement',
        title: 'Total Hip Replacement',
        shortDesc: 'Advanced surgical procedure to replace damaged hip joints, restoring mobility and eliminating pain.',
        fullDesc: `
      <p>Total Hip Replacement is a surgical procedure in which the hip joint is replaced by a prosthetic implant. Hip replacement surgery can be performed as a total replacement or a hemi (half) replacement. It is generally conducted to relieve arthritis pain or in some hip fractures.</p>
      <p>We utilize advanced techniques to ensure precise implant positioning, which restores the natural biomechanics of the hip joint. This results in significant pain relief, improved mobility, and a better quality of life for our patients.</p>
    `,
        benefits: [
            'Minimally Invasive Approaches',
            'Durable Implant Options',
            'Rapid Recovery Protocols',
            'Comprehensive Rehabilitation'
        ],
        icon: Bone
    }
];
