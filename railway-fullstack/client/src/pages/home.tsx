import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Sun, NotebookTabs, Keyboard, User, Check, Copy, RotateCcw, Send, Shield, X, Bookmark } from "lucide-react";
import type { SavedNumber, MessageGenerationRequest, MessageGenerationResponse } from "@shared/schema";


export default function Home() {
  const { toast } = useToast();
  const [isManualEntryMode, setIsManualEntryMode] = useState(false);
  const [selectedContact, setSelectedContact] = useState<{ name: string; phone: string } | null>(null);
  const [phoneInput, setPhoneInput] = useState("");
  const [messageCategory, setMessageCategory] = useState<"sweet" | "romantic" | "poetic">("sweet");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeWeather, setIncludeWeather] = useState(false);
  const [messageLength, setMessageLength] = useState<"short" | "medium" | "long">("medium");
  const [generatedMessage, setGeneratedMessage] = useState<string>("");
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Load user preferences from localStorage on component mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('goodMorningPreferences');
    if (savedPreferences) {
      try {
        const prefs = JSON.parse(savedPreferences);
        if (prefs.messageCategory) setMessageCategory(prefs.messageCategory);
        if (typeof prefs.includeEmojis === 'boolean') setIncludeEmojis(prefs.includeEmojis);
        if (typeof prefs.includeWeather === 'boolean') setIncludeWeather(prefs.includeWeather);
        if (prefs.messageLength) setMessageLength(prefs.messageLength);
      } catch (error) {
        console.error('Failed to load saved preferences:', error);
      }
    }
  }, []);

  // Save user preferences to localStorage whenever they change
  useEffect(() => {
    const preferences = {
      messageCategory,
      includeEmojis,
      includeWeather,
      messageLength
    };
    localStorage.setItem('goodMorningPreferences', JSON.stringify(preferences));
  }, [messageCategory, includeEmojis, includeWeather, messageLength]);

  // Fetch saved numbers
  const { data: savedNumbers = [] } = useQuery<SavedNumber[]>({
    queryKey: ["/api/saved-numbers"],
  });

  // Template-based message generation
  const generateMessageLocally = async (options: {
    category: "sweet" | "romantic" | "poetic";
    includeEmojis: boolean;
    includeWeather: boolean;
    messageLength: "short" | "medium" | "long";
  }) => {
    const messageTemplates = {
      sweet: {
        short: [
          "Good morning sunshine! {emoji}",
          "Rise and shine beautiful! {emoji}",
          "Hope your day sparkles! {emoji}",
          "Morning sweetie! {emoji}",
          "Have a lovely day! {emoji}"
        ],
        medium: [
          "Good morning! Hope your day is filled with happiness {emoji}",
          "Rise and shine! Wishing you a wonderful day ahead {emoji}",
          "Morning sunshine! May today bring you lots of joy {emoji}",
          "Good morning beautiful! Hope your day is as sweet as you {emoji}",
          "Wake up and smile! Today is going to be amazing {emoji}"
        ],
        long: [
          "Good morning my dear! I hope you wake up feeling refreshed and ready to take on this beautiful day {emoji}",
          "Rise and shine sunshine! May your morning be bright and your day be filled with wonderful moments {emoji}",
          "Good morning! I'm sending you positive vibes and warm wishes for a day full of happiness and success {emoji}",
          "Wake up beautiful! The world is brighter with you in it, and I hope today brings you everything you deserve {emoji}",
          "Morning sweetie! I hope your coffee is strong, your day is productive, and your heart is full of joy {emoji}"
        ]
      },
      romantic: {
        short: [
          "Good morning my love! {emoji}",
          "Morning gorgeous! {emoji}",
          "You're my sunshine! {emoji}",
          "Love you more today! {emoji}",
          "My heart beats for you! {emoji}"
        ],
        medium: [
          "Good morning my love! You make every day brighter {emoji}",
          "Morning beautiful! Can't wait to see your smile today {emoji}",
          "Rise and shine my heart! You're my everything {emoji}",
          "Good morning gorgeous! Thinking of you always {emoji}",
          "Wake up my darling! You're the reason I smile {emoji}"
        ],
        long: [
          "Good morning my love! Every sunrise reminds me how blessed I am to have you in my life {emoji}",
          "Rise and shine beautiful! You're the first thing on my mind every morning and the last before I sleep {emoji}",
          "Good morning my heart! Distance means nothing when you mean everything, thinking of you always {emoji}",
          "Morning my darling! Your love gives me strength for each new day, and I cherish every moment with you {emoji}",
          "Wake up gorgeous! You're not just my love, you're my best friend, my inspiration, and my whole world {emoji}"
        ]
      },
      poetic: {
        short: [
          "Dawn whispers your name {emoji}",
          "Morning paints the sky golden {emoji}",
          "Sunrise brings new dreams {emoji}",
          "Light dances through windows {emoji}",
          "Nature awakens with beauty {emoji}"
        ],
        medium: [
          "As morning light kisses the earth, my thoughts drift to you {emoji}",
          "The sun rises like hope in my heart, thinking of you {emoji}",
          "Dawn breaks with whispered promises of a beautiful day {emoji}",
          "Morning dew sparkles like diamonds, reflecting your grace {emoji}",
          "The world awakens to symphony of birds singing your name {emoji}"
        ],
        long: [
          "As dawn breaks and paints the sky in shades of gold and pink, my heart whispers your name softly {emoji}",
          "The morning sun rises like a gentle symphony, filling the world with light as you fill my days with joy {emoji}",
          "In the quiet moments before the world awakens, I find peace knowing you're somewhere under this same beautiful sky {emoji}",
          "Like flowers that bloom with morning's first light, my love for you grows stronger with each passing day {emoji}",
          "The gentle breeze carries my thoughts to you as birds sing their morning songs and the world comes alive {emoji}"
        ]
      }
    };

    // Get random message from templates
    const categoryMessages = messageTemplates[options.category][options.messageLength];
    let message = categoryMessages[Math.floor(Math.random() * categoryMessages.length)];

    // Add emojis if requested
    if (options.includeEmojis) {
      const emojiSets = {
        sweet: ["☀️💕", "🌅✨", "💖🌸", "😊🌺", "🌻💫"],
        romantic: ["💖🌹", "❤️🌅", "💕✨", "😍💝", "🥰💖"],
        poetic: ["🌄💫", "🌅🕊️", "✨🌸", "🌺🦋", "🌻🌙"]
      };
      const emojis = emojiSets[options.category];
      const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      message = message.replace('{emoji}', selectedEmoji);
    } else {
      message = message.replace(' {emoji}', '');
    }

    // Add weather reference if requested
    if (options.includeWeather) {
      const weatherPhrases = [
        " Hope the weather is as perfect as you are!",
        " May the sunshine warm your heart today!",
        " Whatever the weather, you brighten my day!",
        " Rain or shine, you make everything beautiful!",
        " The forecast says lovely, just like you!"
      ];
      const weatherPhrase = weatherPhrases[Math.floor(Math.random() * weatherPhrases.length)];
      message += weatherPhrase;
    }

    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return message;
  };

  // Generate message mutation
  const generateMessageMutation = useMutation({
    mutationFn: async (data: MessageGenerationRequest): Promise<MessageGenerationResponse> => {
      // Use local template generation for reliability
      const message = await generateMessageLocally({
        category: data.category,
        includeEmojis: data.includeEmojis,
        includeWeather: data.includeWeather,
        messageLength: data.messageLength
      });
      
      return { message, category: data.category };
    },
    onSuccess: (data) => {
      setGeneratedMessage(data.message);
      
      // Automatically open iMessage with the generated message
      const phoneNumber = getSelectedPhoneNumber();
      if (phoneNumber && data.message) {
        const encodedMessage = encodeURIComponent(data.message);
        const smsUrl = `sms:${phoneNumber}&body=${encodedMessage}`;
        window.location.href = smsUrl;
      }
      
      toast({
        title: "Message generated!",
        description: "Your AI-powered good morning message is ready and iMessage is opening.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save number mutation
  const saveNumberMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; contactName?: string }) => {
      const response = await apiRequest("POST", "/api/save-number", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-numbers"] });
      toast({
        title: "Number saved!",
        description: "Phone number has been saved for quick access.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save phone number.",
        variant: "destructive",
      });
    },
  });

  const toggleManualEntry = () => {
    setIsManualEntryMode(!isManualEntryMode);
    if (!isManualEntryMode) {
      setSelectedContact(null);
    }
  };

  const handleContactPicker = () => {
    // Check if we're on mobile or have contact picker API support
    if ('contacts' in navigator && 'ContactsManager' in window) {
      // Use the Contact Picker API (Chrome/Edge on Android)
      try {
        (navigator as any).contacts.select(['name', 'tel']).then((contacts: any[]) => {
          if (contacts.length > 0) {
            const contact = contacts[0];
            const phone = contact.tel && contact.tel.length > 0 ? contact.tel[0] : '';
            setSelectedContact({
              name: contact.name || 'Contact',
              phone: phone
            });
            setIsManualEntryMode(false);
            toast({
              title: "Contact selected!",
              description: `${contact.name || 'Contact'} has been selected.`,
            });
          }
        }).catch(() => {
          fallbackContactPicker();
        });
      } catch {
        fallbackContactPicker();
      }
    } else {
      fallbackContactPicker();
    }
  };

  const fallbackContactPicker = () => {
    // For macOS/desktop, provide instructions or manual entry
    toast({
      title: "Contact Selection",
      description: "Please use manual entry or copy a number from your Contacts app.",
    });
    setIsManualEntryMode(true);
  };

  const loadSavedNumber = (numberId: string) => {
    const savedNumber = savedNumbers.find(num => num.id === numberId);
    if (savedNumber) {
      setPhoneInput(savedNumber.phoneNumber);
      if (savedNumber.contactName) {
        setSelectedContact({
          name: savedNumber.contactName,
          phone: savedNumber.phoneNumber
        });
      }
    }
  };

  const savePhoneNumber = () => {
    if (!phoneInput.trim()) {
      toast({
        title: "No number to save",
        description: "Please enter a phone number first.",
        variant: "destructive",
      });
      return;
    }

    const contactName = selectedContact?.name || `Contact (${phoneInput})`;
    saveNumberMutation.mutate({
      phoneNumber: phoneInput,
      contactName,
    });
  };

  const getSelectedPhoneNumber = (): string => {
    if (selectedContact) return selectedContact.phone;
    if (isManualEntryMode && phoneInput.trim()) return phoneInput.trim();
    return "";
  };

  const generateMessage = () => {
    const phoneNumber = getSelectedPhoneNumber();
    if (!phoneNumber) {
      toast({
        title: "No contact selected",
        description: "Please select a contact or enter a phone number.",
        variant: "destructive",
      });
      return;
    }

    generateMessageMutation.mutate({
      category: messageCategory,
      includeEmojis,
      includeWeather,
      messageLength,
      phoneNumber,
    });
  };

  const copyMessage = async () => {
    if (!generatedMessage) return;
    
    try {
      await navigator.clipboard.writeText(generatedMessage);
      toast({
        title: "Message copied!",
        description: "Message has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = () => {
    const phoneNumber = getSelectedPhoneNumber();
    if (!phoneNumber || !generatedMessage) return;

    const encodedMessage = encodeURIComponent(generatedMessage);
    const smsUrl = `sms:${phoneNumber}&body=${encodedMessage}`;
    
    // Open SMS/iMessage app
    window.location.href = smsUrl;
  };

  const clearSelectedContact = () => {
    setSelectedContact(null);
    setPhoneInput("");
  };

  return (
    <div className="bg-ios-bg font-sf min-h-screen flex items-center justify-center p-4">
      <div className="bg-ios-card rounded-xl shadow-lg max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-ios-blue to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Sun className="text-white text-2xl" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Good Morning</h1>
          <p className="text-ios-gray text-sm">Generate personalized morning messages with AI</p>
        </div>

        {/* Contact Selection */}
        <div className="space-y-4 mb-6">
          <Label className="block text-gray-900 font-medium text-sm">Send To</Label>
          
          {/* Contact Picker Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button 
              onClick={handleContactPicker}
              className={`flex items-center justify-center space-x-2 rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 active:scale-95 ${
                !isManualEntryMode 
                  ? 'bg-ios-blue text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <NotebookTabs size={16} />
              <span>Contacts</span>
            </Button>
            
            <Button 
              onClick={toggleManualEntry}
              className={`flex items-center justify-center space-x-2 rounded-lg py-3 px-4 font-medium text-sm transition-all duration-200 active:scale-95 ${
                isManualEntryMode 
                  ? 'bg-ios-blue text-white hover:bg-blue-600' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Keyboard size={16} />
              <span>Manual</span>
            </Button>
          </div>

          {/* Manual Entry Section */}
          {isManualEntryMode && (
            <div className="space-y-3">
              {/* Saved Numbers Dropdown */}
              <Select onValueChange={loadSavedNumber}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="📱 Select saved contact" />
                </SelectTrigger>
                <SelectContent>
                  {savedNumbers.map((number) => (
                    <SelectItem key={number.id} value={number.id}>
                      {number.contactName || number.phoneNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Phone Input */}
              <div className="relative">
                <Input 
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="pr-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={savePhoneNumber}
                  disabled={saveNumberMutation.isPending}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-ios-blue hover:text-blue-600 p-1"
                >
                  <Bookmark size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Selected Contact Display */}
          {selectedContact && (
            <div className="bg-ios-blue bg-opacity-10 rounded-lg p-3 border border-ios-blue border-opacity-20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-ios-blue rounded-full flex items-center justify-center">
                    <User className="text-white" size={12} />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{selectedContact.name}</div>
                    <div className="text-ios-gray text-xs">{selectedContact.phone}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSelectedContact}
                  className="text-ios-gray hover:text-gray-600 p-1"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Message Generation */}
        <div className="space-y-4 mb-6">
          <Label className="block text-gray-900 font-medium text-sm">Message Style</Label>
          
          <Select value={messageCategory} onValueChange={(value: "sweet" | "romantic" | "poetic") => setMessageCategory(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sweet">💝 Sweet & Caring</SelectItem>
              <SelectItem value="romantic">💕 Romantic & Loving</SelectItem>
              <SelectItem value="poetic">🌸 Poetic & Artistic</SelectItem>
            </SelectContent>
          </Select>

          {/* AI Generation Options */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">AI Customization</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="emojis"
                  checked={includeEmojis}
                  onCheckedChange={(checked) => setIncludeEmojis(!!checked)}
                />
                <Label htmlFor="emojis" className="text-sm text-gray-600">Emojis</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="weather"
                  checked={includeWeather}
                  onCheckedChange={(checked) => setIncludeWeather(!!checked)}
                />
                <Label htmlFor="weather" className="text-sm text-gray-600">Weather</Label>
              </div>
            </div>

            {/* Message Length Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Message Length</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="short"
                    checked={messageLength === "short"}
                    onCheckedChange={(checked) => checked && setMessageLength("short")}
                  />
                  <Label htmlFor="short" className="text-xs text-gray-600">Short (7-10 words)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="medium"
                    checked={messageLength === "medium"}
                    onCheckedChange={(checked) => checked && setMessageLength("medium")}
                  />
                  <Label htmlFor="medium" className="text-xs text-gray-600">Medium (10-20 words)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="long"
                    checked={messageLength === "long"}
                    onCheckedChange={(checked) => checked && setMessageLength("long")}
                  />
                  <Label htmlFor="long" className="text-xs text-gray-600">Long (20-30 words)</Label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateMessage}
          disabled={generateMessageMutation.isPending}
          className="w-full bg-gradient-to-r from-ios-blue to-blue-600 text-white rounded-lg py-4 px-6 font-semibold text-base hover:shadow-lg active:scale-95 disabled:opacity-50"
        >
          {generateMessageMutation.isPending ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="animate-spin" size={16} />
              <span>Generating...</span>
            </div>
          ) : (
            <span>✨ Generate AI Message</span>
          )}
        </Button>

        {/* Generated Message */}
        {generatedMessage && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-ios-green rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="text-white" size={14} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm mb-2">Generated Message</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {generatedMessage}
                  </p>
                  
                  {/* Message Actions */}
                  <div className="flex space-x-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={generateMessage}
                      className="text-ios-blue hover:text-blue-600 text-sm font-medium p-0"
                    >
                      <RotateCcw size={12} className="mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyMessage}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium p-0"
                    >
                      <Copy size={12} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Message Button */}
            <Button 
              onClick={sendMessage}
              className="w-full bg-ios-green text-white rounded-lg py-4 px-6 font-semibold text-base hover:shadow-lg active:scale-95 flex items-center justify-center space-x-3"
            >
              <Send size={16} />
              <span>Send via iMessage</span>
            </Button>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={() => setPrivacyModalOpen(true)}
            className="text-ios-gray hover:text-gray-600 text-xs p-0"
          >
            <Shield size={12} className="mr-1" />
            Privacy Policy & Data Handling
          </Button>
        </div>
      </div>

      {/* Privacy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔒 Data Security</h3>
              <p>Phone numbers are securely stored using encrypted backend storage. We never store message content or personal conversations.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Processing</h3>
              <p>Messages are generated using OpenAI's API. No personal data is shared with AI services beyond the message category you select.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📱 Contact Access</h3>
              <p>Contact picker uses your device's native contact app. We don't access or store your contact list.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🗑️ Data Deletion</h3>
              <p>You can delete saved numbers anytime. All data is removed from our servers within 24 hours of deletion.</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              Last updated: January 2024 • 
              <a href="#" className="text-ios-blue hover:underline">Full Privacy Policy</a>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
