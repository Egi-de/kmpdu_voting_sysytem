import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/shared/Logo';
import { Input } from '@/components/ui/input';
import { mockUser } from '@/data/mockData';
import {
  Shield,
  Vote,
  Users,
  Lock,
  BarChart3,
  Bell,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Search,
  User,
  MapPin,
  Mail,
  Phone,
  Star,
  Play,
} from 'lucide-react';

const Index = () => {
  const [verificationNumber, setVerificationNumber] = useState('');
  const [verifiedVoter, setVerifiedVoter] = useState<typeof mockUser | null>(null);
  const [verificationError, setVerificationError] = useState('');

  const handleVerify = () => {
    setVerificationError('');
    setVerifiedVoter(null);
    
    if (!verificationNumber.trim()) {
      setVerificationError('Please enter your KMPDU membership number');
      return;
    }

    if (verificationNumber.toUpperCase() === mockUser.memberId) {
      setVerifiedVoter(mockUser);
    } else {
      setVerificationError('No voter found with this membership number');
    }
  };

  const features = [
    {
      icon: CheckCircle2,
      title: 'Blockchain Verified',
      description: 'Every Vote is recorded on an immutable blockchain ledger, ensuring complete transparency and preventing any tampering or fraud.',
      color: 'bg-blue-500',
      borderColor: 'border-blue-200',
    },
    {
      icon: Lock,
      title: 'Blockchain Verified',
      description: 'Your vote is completely anonymous and encrypted. Even system administrators cannot see who you voted for.',
      color: 'bg-green-500',
      borderColor: 'border-green-200',
    },
    {
      icon: BarChart3,
      title: 'Real-Time Results',
      description: 'Watch live vote counts and statistics update every second. Full transparency with instant result visualization.',
      color: 'bg-orange-500',
      borderColor: 'border-orange-200',
    },
    {
      icon: Users,
      title: 'Two-Level Voting',
      description: 'Vote For national leadership and your specific branch representatives. Smart system prevents cross-branch voting.',
      color: 'bg-purple-500',
      borderColor: 'border-purple-200',
    },
    {
      icon: Bell,
      title: 'SMS Notifications',
      description: 'Receive instant confirmation via SMS when you vote, plus updates on election announcements and results.',
      color: 'bg-pink-500',
      borderColor: 'border-pink-200',
    },
    {
      icon: Shield,
      title: 'Anti-Fraud System',
      description: 'one vote per person per position. Votes cannot Be altered or deleted. Complete audit trail for verification.',
      color: 'bg-cyan-500',
      borderColor: 'border-cyan-200',
    },
  ];

  const stats = [
    { value: '15,247+', label: 'Registered Voters' },
    { value: '12,891+', label: 'Voters Cast' },
    { value: '47', label: 'Active Branches' },
    { value: '100%', label: 'Secure & Private' },
  ];

  const steps = [
    {
      number: '1',
      title: 'Login & Verify',
      description: 'Login with your unique KMPDU membership number and verify your identity securely',
      color: 'text-blue-500 border-blue-500',
    },
    {
      number: '2',
      title: 'Select Candidates',
      description: 'Review candidates for national and branch position. Read profiles and manifestos',
      color: 'text-green-500 border-green-500',
    },
    {
      number: '3',
      title: 'Cast Your Vote',
      description: 'Submit your encrypted vote. Your choice is recorded on the blockchain instantly.',
      color: 'text-orange-500 border-orange-500',
    },
    {
      number: '4',
      title: 'Get Confirmation',
      description: 'Receive SMS confirmation and view your blockchain verification receipt.',
      color: 'text-purple-500 border-purple-500',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Kimani',
      role: 'Secretary General',
      quote: 'The blockchain verification gives me complete confidence in the integrity of our union elections. This is the future of democratic voting.',
      rating: 5,
    },
    {
      name: 'Dr. James Mwangi',
      role: 'Branch Secretary',
      quote: 'I was able to vote from my phone in less than 2 minutes. The SMS confirmation and blockchain receipt made me feel secure about my vote.',
      rating: 5,
    },
    {
      name: 'Dr. Grace Ochieng',
      role: 'Union Member',
      quote: 'Finally, a voting system that is transparent, secure, and easy to use. I could vote from anywhere without compromising my privacy.',
      rating: 5,
    },
  ];

  return (
    <div className="force-light min-h-screen bg-background">
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Logo variant="light" />
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                How It Works
              </a>
              <a href="#demo" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Demo
              </a>
              <a href="#contact" className="text-sm font-medium text-white hover:text-white/80 transition-colors">
                Contact
              </a>
            </div>
            <Link to="/login">
              <Button className="bg-white hover:bg-gray-100 text-[#3B5998] font-semibold px-6 py-2 h-auto rounded-md text-sm">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-[600px] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/heroarea_bg.png)' }}
        >
          <div className="absolute inset-0 bg-[#163269]/40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Secure, Transparent & Democratic
              <br />
              <span className="text-[#7db3ff]">Union Elections Platform</span>
            </h1>
            
            <p className="text-base md:text-lg text-white mb-8 max-w-4xl mx-auto leading-relaxed">
              Empowering KMPDU members with blockchain-verified voting technology.
              Cast your vote securely from anywhere, anytime with complete privacy and transparency
            </p>
            
            <Link to="/login">
              <Button size="lg" className="bg-white text-[#3B5998] hover:bg-gray-100 px-8 h-12 text-base font-semibold rounded-md">
                Start Voting Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-200 relative overflow-hidden">
        <img 
          src="/design.png" 
          alt="" 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 h-full object-contain"
        />
        <img 
          src="/design.png" 
          alt="" 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-full object-contain scale-x-[-1]"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-1">{stat.value}</div>
                <div className="text-sm text-green-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f0f7ff] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-2">
            why choose KMPDU E-Voting
          </div>
        </div>
      </section>

      <section id="features" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              Built for Trust, Security & Transparency
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge blockchain technology with user-friendly design
              to deliver the most secure voting experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className={`border-2 ${feature.borderColor} hover:shadow-lg transition-all duration-300`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1e3a8a] mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#f0f7ff] text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium mb-2">
            How It's Works
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              Simple 4-Step Voting Process
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed for ease of use while maintaining the highest security standards.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {steps.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 rounded-full border-2 ${item.color} flex items-center justify-center mx-auto mb-4`}>
                  <span className={`text-3xl font-bold ${item.color.split(' ')[0]}`}>{item.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-block bg-blue-50 rounded-lg p-4 border border-blue-100">
              <a href="#demo">
                <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  See It In Action
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              Watch How Easy It Is to Vote
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience our secure, user-friendly voting process from login to confirmation in this quick demo
            </p>
          </div>
          
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="lg:w-2/3">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/demo.png" 
                    alt="Voting System Demo" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center shadow-lg cursor-pointer hover:bg-green-600 transition-colors">
                      <Play className="h-10 w-10 text-white ml-1" fill="white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:absolute lg:right-0 lg:bottom-8 lg:w-1/2 mt-8 lg:mt-0">
                <Card className="border-2 border-blue-200 shadow-xl bg-white">
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#1e3a8a] flex items-center justify-center">
                        <Shield className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#1e3a8a]">Vote Verification</h3>
                        <p className="text-sm text-gray-600">Blockchain Receipt</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 p-4 bg-gray-50 rounded-xl font-mono text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID</span>
                        <span className="text-[#1e3a8a] font-semibold">0x7f3a...8b2c</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Block Number</span>
                        <span className="text-[#1e3a8a] font-semibold">#12,847,392</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Timestamp</span>
                        <span className="text-[#1e3a8a] font-semibold">2024-03-15 14:32:01</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status</span>
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Verified
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-4 text-center">
                      Your vote has been permanently recorded on the blockchain
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 lg:mt-16">
                <h3 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-4">
                  Your Vote is Protected by
                  <br />
                  Blockchain Technology
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              What Our Members Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from KMPDU members who have experienced our secure voting platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-[#1e3a8a] to-[#3b82f6] border-0">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white mb-6 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-white/20 pt-4">
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-blue-200 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <div className="inline-block bg-blue-50 rounded-lg p-4 border border-blue-100">
              <Button className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                View All Reviews
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="verify" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              Check Your Voter Details
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enter your KMPDU membership number to verify your registration details before voting
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-gray-200 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter KMPDU Number (e.g., KMPDU-2024-00456)"
                      value={verificationNumber}
                      onChange={(e) => setVerificationNumber(e.target.value)}
                      className="h-12 bg-transparent"
                    />
                  </div>
                  <Button
                    onClick={handleVerify}
                    className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white h-12 px-8"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Verify
                  </Button>
                </div>

                {verifiedVoter && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-[#1e3a8a]">Voter Found</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-[#1e3a8a]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Full Name</p>
                          <p className="font-medium text-[#1e3a8a]">{verifiedVoter.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Fingerprint className="h-5 w-5 text-[#1e3a8a]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Membership ID</p>
                          <p className="font-medium text-[#1e3a8a]">{verifiedVoter.memberId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Assigned Branch</p>
                          <p className="font-medium text-[#1e3a8a]">{verifiedVoter.branch}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Email Address</p>
                          <p className="font-medium text-[#1e3a8a]">{verifiedVoter.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 md:col-span-2">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-[#1e3a8a]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Phone Number</p>
                          <p className="font-medium text-[#1e3a8a]">{verifiedVoter.phone}</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 text-center">
                      If your details are incorrect, please contact KMPDU support to update your information.
                    </p>
                  </div>
                )}

                {verificationError && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="p-4 bg-red-50 rounded-xl text-center">
                      <p className="text-red-600 font-medium">{verificationError}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Please check your membership number and try again.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Ready to Cast Your Vote
              </h2>
              <p className="text-base text-white/90 max-w-xl">
                Join Thousands of KMPDU members who have already voted securely and Transparently.
              </p>
            </div>
            <Link to="/login">
              <Button size="lg" className="bg-white text-[#1e3a8a] hover:bg-gray-100 px-8 h-12 text-base font-semibold whitespace-nowrap">
                Login to Vote Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer id="contact" className="py-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <Logo className="mb-4" />
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Empowering democratic participation through secure, transparent, and blockchain-verified electronic voting for all KMPDU members.
              </p>

            </div>
            
            <div>
              <h4 className="font-semibold text-[#1e3a8a] mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Security</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Features</a></li>
                <li><a href="#contact" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-[#1e3a8a] mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Voting Guide</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">FAQs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#1e3a8a] mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-[#3b82f6] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600 text-sm">KMPDU Headquarters, Nairobi, Kenya</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-[#3b82f6] flex-shrink-0" />
                  <a href="tel:+254700000000" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">+254 700 000 000</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#3b82f6] flex-shrink-0" />
                  <a href="mailto:support@kmpdu-evoting.ke" className="text-gray-600 hover:text-[#1e3a8a] transition-colors text-sm">support@kmpdu-evoting.ke</a>
                </li>
              </ul>
              <div className="flex items-center gap-4 mt-6">
                <a href="#" className="w-10 h-10 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-colors group">
                  <svg className="w-5 h-5 text-[#1e3a8a] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center hover:bg-[#1e3a8a] hover:text-white transition-colors group">
                  <svg className="w-5 h-5 text-[#1e3a8a] group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center hover:bg-[#1e3a8a] transition-colors group">
                  <svg className="w-5 h-5 text-[#1e3a8a] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
                <a href="mailto:support@kmpdu-evoting.ke" className="w-10 h-10 rounded-full border-2 border-[#1e3a8a] flex items-center justify-center hover:bg-[#1e3a8a] transition-colors group">
                  <Mail className="w-5 h-5 text-[#1e3a8a] group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              © 2024 KMPDU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
