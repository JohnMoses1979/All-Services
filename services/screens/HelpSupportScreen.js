import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { API_BASE_URL } from "../api/providerApi";
import { OWNER_COLORS } from "../styles/ownerTheme";

const COLORS = {
  bg: OWNER_COLORS.background,
  text: OWNER_COLORS.text,
  muted: OWNER_COLORS.muted,
  border: OWNER_COLORS.border,
  purple: OWNER_COLORS.primary,
  purpleDark: OWNER_COLORS.header,
  purpleSoft: OWNER_COLORS.surfaceAlt,
  green: OWNER_COLORS.primaryLight,
  greenSoft: OWNER_COLORS.surfaceAlt,
  red: OWNER_COLORS.danger,
  redSoft: "#FFFFFF",
  blue: OWNER_COLORS.primary,
  accent: OWNER_COLORS.accent,
};

export default function HelpSupportScreen({ navigation }) {
  const [screen, setScreen] = useState("home");
  const [selectedGuide, setSelectedGuide] = useState(null);

  const openGuide = (guide) => {
    setSelectedGuide(guide);
    setScreen("guide");
  };

  const goBack = () => {
    if (screen !== "home") {
      setScreen("home");
      return;
    }

    navigation?.goBack?.();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.purpleDark} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={goBack} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={23} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help & Support</Text>

        <View style={{ width: 38 }} />
      </View>

      {screen === "home" && (
        <HelpHomeScreen
          onOpenGuide={openGuide}
          onOpenChat={() => setScreen("chat")}
          onOpenContact={() => setScreen("contact")}
        />
      )}

      {screen === "guide" && <GuideDetailsScreen guide={selectedGuide} />}

      {screen === "contact" && <ContactScreen onOpenChat={() => setScreen("chat")} />}

      {screen === "chat" && <AIChatScreen />}
    </SafeAreaView>
  );
}

function HelpHomeScreen({ onOpenGuide, onOpenChat, onOpenContact }) {
  const quickHelp = [
    {
      id: "book",
      title: "How to Book a Service",
      subtitle: "Step-by-step booking guide",
      icon: "clipboard-text-outline",
      color: COLORS.purple,
      steps: [
        {
          title: "Choose a Service",
          text: "Browse and select the service you need.",
        },
        {
          title: "Select Date & Time",
          text: "Pick your preferred date and time.",
        },
        {
          title: "Add Address",
          text: "Enter your service address for the professional.",
        },
        {
          title: "Make Payment",
          text: "Choose a payment method and complete the payment.",
        },
        {
          title: "Booking Confirmed",
          text: "You will receive confirmation once booking is done.",
        },
      ],
    },
    {
      id: "payment",
      title: "Payment & Wallet",
      subtitle: "Help with payments and wallet",
      icon: "credit-card-outline",
      color: "#1A7A7A",
      steps: [
        {
          title: "Open Wallet",
          text: "Go to My Wallet from your profile or bookings screen.",
        },
        {
          title: "Check Balance",
          text: "Verify your available wallet balance and transactions.",
        },
        {
          title: "Payment Failed",
          text: "If money is deducted, wait for automatic refund or contact support.",
        },
      ],
    },
    {
      id: "cancel",
      title: "Cancellations & Refunds",
      subtitle: "Policy and refund information",
      icon: "file-document-outline",
      color: "#D94848",
      steps: [
        {
          title: "Open Booking",
          text: "Go to My Bookings and select the booking.",
        },
        {
          title: "Cancel Request",
          text: "Tap cancel booking and select the reason.",
        },
        {
          title: "Refund Status",
          text: "Refund status will be visible in your wallet or payment history.",
        },
      ],
    },
    {
      id: "account",
      title: "Account & Profile",
      subtitle: "Manage your account and profile",
      icon: "account-outline",
      color: OWNER_COLORS.primary,
      steps: [
        {
          title: "Open Profile",
          text: "Go to My Profile from bottom navigation.",
        },
        {
          title: "Edit Details",
          text: "Tap Personal Information and update your details.",
        },
        {
          title: "Save Changes",
          text: "Submit the form to save your updated information.",
        },
      ],
    },
    {
      id: "refer",
      title: "Refer & Earn",
      subtitle: "Everything about referrals",
      icon: "share-variant-outline",
      color: OWNER_COLORS.accent,
      steps: [
        {
          title: "Open Refer & Earn",
          text: "Go to profile and tap Refer & Earn.",
        },
        {
          title: "Share Code",
          text: "Share your referral code with friends.",
        },
        {
          title: "Earn Rewards",
          text: "Rewards will be added after successful referral activity.",
        },
      ],
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>


      <Text style={styles.sectionTitle}>Quick Help</Text>

      <View style={styles.helpList}>
        {quickHelp.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.helpItem}
            activeOpacity={0.85}
            onPress={() => onOpenGuide(item)}
          >
            <View style={[styles.helpIconBox, { backgroundColor: item.color + "12" }]}>
              <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.helpTitle}>{item.title}</Text>
              <Text style={styles.helpSub}>{item.subtitle}</Text>
            </View>

            <Feather name="chevron-right" size={21} color={COLORS.muted} />

            {index !== quickHelp.length - 1 && <View style={styles.itemDivider} />}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Still need help?</Text>

      <View style={styles.supportRow}>
        <TouchableOpacity style={styles.supportCard} activeOpacity={0.85} onPress={onOpenChat}>
          <View style={styles.supportIcon}>
            <Ionicons name="chatbubble-ellipses-outline" size={27} color={COLORS.purple} />
          </View>
          <Text style={styles.supportTitle}>Chat with Us</Text>
          <Text style={styles.supportSub}>We’re online</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportCard} activeOpacity={0.85} onPress={onOpenContact}>
          <View style={styles.supportIcon}>
            <Ionicons name="call-outline" size={27} color={COLORS.purple} />
          </View>
          <Text style={styles.supportTitle}>Call Us</Text>
          <Text style={styles.supportSub}>+91 9876543210</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 25 }} />
    </ScrollView>
  );
}

function GuideDetailsScreen({ guide }) {
  const [feedback, setFeedback] = useState(null);

  const selectedGuide = guide || {
    title: "How to Book a Service",
    steps: [],
  };

  const handleFeedback = (type) => {
    setFeedback(type);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.guideHero}>
        <View style={styles.characterCircle}>
          <Ionicons name="person" size={42} color={COLORS.purple} />
        </View>

        <View style={styles.questionBubble}>
          <Text style={styles.questionText}>?</Text>
        </View>
      </View>

      <Text style={styles.guideTitle}>{selectedGuide.title}</Text>
      <Text style={styles.guideSub}>
        Follow these simple steps to complete this process in your app.
      </Text>

      <View style={styles.stepsWrap}>
        {selectedGuide.steps?.map((step, index) => (
          <View key={index.toString()} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>

            {index !== selectedGuide.steps.length - 1 && <View style={styles.stepLine} />}

            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.wasHelpfulTitle}>Was this helpful?</Text>

      <View style={styles.voteRow}>
        <TouchableOpacity
          style={[
            styles.voteBtn,
            feedback === "yes" && styles.voteBtnActiveYes,
          ]}
          activeOpacity={0.85}
          onPress={() => handleFeedback("yes")}
        >
          <Feather
            name="thumbs-up"
            size={18}
            color={feedback === "yes" ? "#fff" : COLORS.text}
          />
          <Text
            style={[
              styles.voteText,
              feedback === "yes" && styles.voteTextActive,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.voteBtn,
            feedback === "no" && styles.voteBtnActiveNo,
          ]}
          activeOpacity={0.85}
          onPress={() => handleFeedback("no")}
        >
          <Feather
            name="thumbs-down"
            size={18}
            color={feedback === "no" ? "#fff" : COLORS.text}
          />
          <Text
            style={[
              styles.voteText,
              feedback === "no" && styles.voteTextActive,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>

      {feedback === "yes" && (
        <View style={styles.feedbackBoxYes}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.green} />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackTitle}>Thank you for your feedback!</Text>
            <Text style={styles.feedbackText}>
              We’re glad this helped you.
            </Text>
          </View>
        </View>
      )}

      {feedback === "no" && (
        <View style={styles.feedbackBoxNo}>
          <Ionicons name="alert-circle" size={22} color={COLORS.red} />
          <View style={{ flex: 1 }}>
            <Text style={styles.feedbackTitle}>Thanks for letting us know.</Text>
            <Text style={styles.feedbackText}>
              You can use Chat with Us for more help from the AI support assistant.
            </Text>
          </View>
        </View>
      )}

      <View style={{ height: 25 }} />
    </ScrollView>
  );
}

function ContactScreen({ onOpenChat }) {
  const contactItems = [
    {
      title: "Call Us",
      subtitle: "+91 9876543210\n9:00 AM - 9:00 PM",
      icon: "call-outline",
      color: COLORS.purple,
      onPress: () => Linking.openURL("tel:+919876543210"),
    },
    {
      title: "WhatsApp",
      subtitle: "+91 98765 43210\n9:00 AM - 9:00 PM",
      icon: "logo-whatsapp",
      color: OWNER_COLORS.primary,
      onPress: () => Linking.openURL("https://wa.me/919876543210"),
    },
    {
      title: "Email Us",
      subtitle: "support@servicehub.com\nWe reply within 24 hours",
      icon: "mail-outline",
      color: OWNER_COLORS.primary,
      onPress: () => Linking.openURL("mailto:support@servicehub.com"),
    },
    {
      title: "Live Chat",
      subtitle: "Chat with our support team\nAvailable 24/7",
      icon: "chatbubble-ellipses-outline",
      color: COLORS.purple,
      onPress: onOpenChat,
    },
  ];

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.contactTitle}>Contact Us</Text>
      <Text style={styles.contactSub}>We’re here to help you</Text>

      <View style={styles.contactCard}>
        {contactItems.map((item, index) => (
          <TouchableOpacity
            key={item.title}
            style={styles.contactItem}
            activeOpacity={0.85}
            onPress={item.onPress}
          >
            <View style={[styles.contactIconBox, { backgroundColor: item.color + "12" }]}>
              <Ionicons name={item.icon} size={23} color={item.color} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.contactItemTitle}>{item.title}</Text>
              <Text style={styles.contactItemSub}>{item.subtitle}</Text>
            </View>

            <Feather name="chevron-right" size={21} color={COLORS.muted} />

            {index !== contactItems.length - 1 && <View style={styles.itemDivider} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contactHelpBox}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.purple} />
        <View style={{ flex: 1 }}>
          <Text style={styles.contactHelpTitle}>Need instant help?</Text>
          <Text style={styles.contactHelpText}>
            Start live AI chat and get quick support for bookings, payments, refunds, and profile issues.
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startChatBtn} activeOpacity={0.85} onPress={onOpenChat}>
        <Ionicons name="sparkles" size={18} color="#fff" />
        <Text style={styles.startChatText}>Start AI Chat</Text>
      </TouchableOpacity>

      <View style={{ height: 25 }} />
    </ScrollView>
  );
}

function AIChatScreen() {
  const flatListRef = useRef(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "bot",
      text: "Hi 👋 I’m your AI support assistant. Ask me anything.",
    },
  ]);

  const sendMessage = async () => {
    const finalText = message.trim();
    if (!finalText || sending) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: finalText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setMessage("");
    setSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/support/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: finalText,
          userId: "demo-user-1",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply || "Sorry, I could not understand that.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.log("Chat API Error:", error);

      const fallbackMsg = {
        id: (Date.now() + 2).toString(),
        sender: "bot",
        text:
          `I could not connect to backend. Please check if Spring Boot is running on ${API_BASE_URL}`,
      };

      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setSending(false);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd?.({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === "user";

    return (
      <View style={[styles.chatRow, isUser ? styles.userRow : styles.botRow]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={15} color="#fff" />
          </View>
        )}

        <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.bubbleText, isUser ? styles.userBubbleText : styles.botBubbleText]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };
  return (
  <KeyboardAvoidingView
    style={styles.chatContainer}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
  >

      <View style={styles.chatTopCard}>
        <View style={styles.chatTopIcon}>
          <Ionicons name="chatbubble-ellipses" size={26} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.chatTopTitle}>AI Support Chat</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false} 
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd?.({ animated: true })}
      />

      {sending && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={COLORS.purple} />
          <Text style={styles.typingText}>AI is typing...</Text>
        </View>
      )}

      <View style={styles.inputBar}>
        <View style={styles.inputBox}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Type your question..."
            placeholderTextColor={COLORS.muted}
            style={styles.chatInput}
            multiline
          />

          <TouchableOpacity
            style={[styles.sendBtn, !message.trim() && styles.sendBtnDisabled]}
            activeOpacity={0.85}
            onPress={sendMessage}
          >
            <Feather name="send" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },

  header: {
    height: 62,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.purpleDark,
  },
  backBtn: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#fff",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },

  searchCard: {
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  searchSub: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 4,
  },
  searchBox: {
    marginTop: 14,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F0FAFA",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
    overflow: "hidden",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    paddingHorizontal: 8,
  },
  searchBtn: {
    width: 48,
    height: "100%",
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 24,
    marginBottom: 12,
  },

  helpList: {
    backgroundColor: "#fff",
  },
  helpItem: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  helpIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.purple,
  },
  helpSub: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 3,
  },
  itemDivider: {
    position: "absolute",
    left: 48,
    right: 0,
    bottom: 0,
    height: 1,
    backgroundColor: COLORS.border,
  },

  supportRow: {
    flexDirection: "row",
    gap: 12,
  },
  supportCard: {
    flex: 1,
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 13,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  supportIcon: {
    width: 42,
    height: 42,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  supportTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.text,
  },
  supportSub: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 4,
    textAlign: "center",
  },

  guideHero: {
    height: 102,
    alignItems: "center",
    justifyContent: "center",
  },
  characterCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  questionBubble: {
    position: "absolute",
    top: 24,
    right: "35%",
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  questionText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  guideTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 6,
  },
  guideSub: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "600",
    marginTop: 8,
    lineHeight: 18,
  },
  stepsWrap: {
    marginTop: 24,
  },
  stepRow: {
    flexDirection: "row",
    minHeight: 76,
    position: "relative",
  },
  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.purpleSoft,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    zIndex: 2,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.purple,
  },
  stepLine: {
    position: "absolute",
    left: 16.5,
    top: 34,
    bottom: 0,
    width: 1,
    backgroundColor: "#F0FAFA",
  },
  stepContent: {
    flex: 1,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },
  stepText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 5,
    lineHeight: 16,
  },
  wasHelpfulTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 20,
    marginBottom: 14,
  },
  voteRow: {
    flexDirection: "row",
    gap: 12,
  },
  voteBtn: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  voteBtnActiveYes: {
    backgroundColor: COLORS.green,
  },
  voteBtnActiveNo: {
    backgroundColor: COLORS.red,
  },
  voteText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },
  voteTextActive: {
    color: "#fff",
  },
  feedbackBoxYes: {
    marginTop: 16,
    backgroundColor: COLORS.greenSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8F5F5",
    padding: 14,
    flexDirection: "row",
    gap: 10,
  },
  feedbackBoxNo: {
    marginTop: 16,
    backgroundColor: COLORS.redSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8F5F5",
    padding: 14,
    flexDirection: "row",
    gap: 10,
  },
  feedbackTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 17,
  },

  contactTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 14,
  },
  contactSub: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 5,
    marginBottom: 18,
  },
  contactCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  contactItem: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  contactIconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactItemTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.text,
  },
  contactItemSub: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 4,
    lineHeight: 16,
  },
  contactHelpBox: {
    marginTop: 18,
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#F0FAFA",
  },
  contactHelpTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
  },
  contactHelpText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 5,
    lineHeight: 18,
  },
  startChatBtn: {
    marginTop: 16,
    height: 48,
    marginBottom: 20,
    borderRadius: 11,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  startChatText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: 8,
  },

  chatContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  chatTopCard: {
    marginHorizontal: 18,
    marginTop: 8,
    backgroundColor: COLORS.purpleSoft,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  chatTopIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  chatTopTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },
  chatTopSub: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.muted,
    marginTop: 4,
  },
  chatContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
    flexGrow: 1,
  },
  chatRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-end",
  },
  botRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bubble: {
    maxWidth: "78%",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
  },
  botBubble: {
    backgroundColor: COLORS.purpleSoft,
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: COLORS.purple,
    borderBottomRightRadius: 5,
  },
  bubbleText: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 19,
  },
  botBubbleText: {
    color: COLORS.text,
  },
  userBubbleText: {
    color: "#fff",
  },
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 6,
  },
  typingText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.muted,
  },
  inputBar: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 24 : 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: "#fff",
  },
  inputBox: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 14,
    paddingRight: 7,
    paddingVertical: 7,
  },
  chatInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    paddingVertical: 8,
  },
  sendBtn: {
    width: 39,
    height: 39,
    borderRadius: 14,
    backgroundColor: COLORS.purple,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sendBtnDisabled: {
    opacity: 0.45,
  },
});


