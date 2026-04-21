import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

/* ─── FONT IMPORT ─────────────────────────────────────────────────────────── */
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Serif+Display&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

/* ─── GLOBAL API KEY CONTEXT ─────────────────────────────────────────────── */
const ApiKeyCtx = createContext({ apiKey:"", setApiKey:()=>{} });
const useApiKey = () => useContext(ApiKeyCtx);

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
const C = {
  bg:      "#FAF7F0",
  white:   "#FFFFFF",
  cream:   "#FFF4EC",
  accent:  "#E63939",
  accent2: "#FF5722",
  green:   "#4CAF50",
  text:    "#2C2C2C",
  sub:     "#7A6652",
  border:  "#EAE0D5",
  gold:    "#FFC107",
  purple:  "#8D4E2A",
  blue:    "#2E7D32",
  dark:    "#1A0A00",
};

/* ─── DATA ───────────────────────────────────────────────────────────────── */
const MENU = [
  { id:1,  name:"Ofada Rice & Sauce",            section:"Restaurant",       price:4500, emoji:"🍚", tag:"🏆 Fan Fave",    popular:true,  healthy:true,  spice:3, cal:620, protein:28, carbs:82, fat:18, ingredients:["Ofada rice","Ayamase sauce","Assorted meat","Crayfish","Palm oil"], desc:"Our signature Ofada with rich Ayamase sauce & assorted meats." },
  { id:2,  name:"Jollof Rice + Grilled Chicken", section:"Restaurant",       price:5200, emoji:"🍳", tag:"",               popular:true,  healthy:false, spice:2, cal:780, protein:42, carbs:88, fat:22, ingredients:["Parboiled rice","Tomato stew","Grilled chicken","Plantain"], desc:"Party-style Jollof with smoky grilled chicken & sweet plantain." },
  { id:3,  name:"Coconut Rice",                  section:"Restaurant",       price:4000, emoji:"🥥", tag:"🌿 Healthy",     popular:false, healthy:true,  spice:1, cal:540, protein:22, carbs:72, fat:14, ingredients:["Long grain rice","Coconut milk","Fish","Vegetables"], desc:"Creamy coconut rice with fresh fish and garden vegetables." },
  { id:4,  name:"Cassava Leaf & Rice",           section:"Restaurant",       price:4200, emoji:"🌿", tag:"",               popular:false, healthy:true,  spice:2, cal:490, protein:24, carbs:68, fat:12, ingredients:["Cassava leaves","Assorted meat","Palm oil","Crayfish"], desc:"Traditional West African cassava leaf stew over steamed rice." },
  { id:5,  name:"Egg Fried Rice",                section:"Restaurant",       price:3800, emoji:"🍳", tag:"",               popular:false, healthy:false, spice:1, cal:560, protein:20, carbs:76, fat:16, ingredients:["Rice","Eggs","Mixed vegetables","Soy sauce"], desc:"Wok-style fried rice with scrambled eggs and crispy veggies." },
  { id:6,  name:"Grilled Chicken",               section:"Grill & Shawarma", price:4800, emoji:"🍗", tag:"🔥 Hot",        popular:true,  healthy:true,  spice:3, cal:420, protein:52, carbs:4,  fat:18, ingredients:["Whole chicken","House spice blend","Suya pepper","Lemon"], desc:"Half chicken marinated in our house blend, charcoal-grilled." },
  { id:7,  name:"Shawarma",                      section:"Grill & Shawarma", price:3500, emoji:"🌯", tag:"",               popular:false, healthy:false, spice:2, cal:510, protein:28, carbs:54, fat:18, ingredients:["Flatbread","Chicken/beef","Veggies","Shawarma sauce"], desc:"Loaded flatbread wrap with your choice of grilled meat." },
  { id:8,  name:"Suya Chicken",                  section:"Grill & Shawarma", price:4200, emoji:"🍢", tag:"🔥 Hot",        popular:true,  healthy:true,  spice:4, cal:380, protein:46, carbs:6,  fat:14, ingredients:["Chicken breast","Suya spice","Groundnut","Onions"], desc:"Spicy Hausa-style skewered chicken with groundnut coating." },
  { id:9,  name:"Burger",                        section:"Grill & Shawarma", price:3800, emoji:"🍔", tag:"",               popular:false, healthy:false, spice:1, cal:650, protein:32, carbs:58, fat:28, ingredients:["Beef patty","Brioche bun","Lettuce","Tomato","House sauce"], desc:"Juicy beef patty on brioche with house special sauce." },
  { id:10, name:"Chocolate Bread",               section:"Bakery",           price:2500, emoji:"🍫", tag:"⭐ Loved",       popular:true,  healthy:false, spice:0, cal:340, protein:8,  carbs:52, fat:14, ingredients:["Flour","Cocoa","Butter","Sugar","Eggs"], desc:"Baked fresh every morning — rich, fudgy, and irresistible." },
  { id:11, name:"Red Velvet Cake (slice)",        section:"Bakery",           price:2800, emoji:"🎂", tag:"",               popular:false, healthy:false, spice:0, cal:420, protein:6,  carbs:64, fat:18, ingredients:["Flour","Red colouring","Cream cheese","Butter","Eggs"], desc:"Moist red velvet with luscious cream cheese frosting." },
  { id:12, name:"Meat Pie",                      section:"Bakery",           price:800,  emoji:"🥧", tag:"",               popular:false, healthy:false, spice:1, cal:280, protein:12, carbs:32, fat:12, ingredients:["Flour","Minced meat","Potatoes","Onions"], desc:"Classic flaky pastry stuffed with spiced minced meat." },
  { id:13, name:"Egusi Soup",                    section:"Soup Factory",     price:3500, emoji:"🥣", tag:"🌿 Healthy",     popular:true,  healthy:true,  spice:2, cal:460, protein:34, carbs:18, fat:28, ingredients:["Ground melon","Assorted meat","Smoked fish","Spinach","Palm oil"], desc:"Ground melon seeds cooked with assorted meat in palm oil." },
  { id:14, name:"Daily Soup Special",            section:"Soup Factory",     price:3200, emoji:"🍲", tag:"",               popular:false, healthy:true,  spice:2, cal:380, protein:28, carbs:14, fat:22, ingredients:["Daily special","Palm oil","Assorted meat","Crayfish"], desc:"Today's kitchen-choice soup — always a different surprise." },
  { id:15, name:"Fresh Fruit Cocktail",          section:"Bar & Drinks",     price:2500, emoji:"🍹", tag:"🌿 Healthy",     popular:false, healthy:true,  spice:0, cal:180, protein:2,  carbs:44, fat:0,  ingredients:["Mixed seasonal fruits","Natural sweetener","Crushed ice"], desc:"Hand-cut seasonal fruits blended fresh to order." },
  { id:16, name:"Attieke & Fish",                section:"Bar & Drinks",     price:4000, emoji:"🐟", tag:"🌍 W. African", popular:false, healthy:true,  spice:2, cal:520, protein:38, carbs:48, fat:14, ingredients:["Attieke","Grilled tilapia","Onions","Tomatoes","Pepper sauce"], desc:"Ivorian fermented cassava couscous with whole grilled tilapia." },
];

const SECTIONS = ["All","Restaurant","Grill & Shawarma","Bakery","Soup Factory","Bar & Drinks"];

const LOCATIONS = [
  { id:"jos",   name:"Jos HQ",   address:"No. 22 Ahmadu Bello Way, Yakubu Gowon Way, Anglo Jos", hours:"8am – 10pm daily", color:C.accent },
  { id:"abuja", name:"Abuja",    address:"Metta Mall, Arab Road, Kubwa, Abuja",                   hours:"9am – 9pm daily",  color:C.green  },
];

const FLASH_DEALS = [
  { id:2, discount:20, label:"Lunch Special" },
  { id:8, discount:15, label:"Grill Rush"    },
  { id:10,discount:25, label:"Baker's Pick"  },
];

const GALLERY_ITEMS = [
  { id:1, emoji:"🍚", label:"Ofada Special",      likes:248, category:"food"  },
  { id:2, emoji:"🍗", label:"Grill Night",         likes:192, category:"food"  },
  { id:3, emoji:"🎉", label:"Birthday Setup",      likes:317, category:"vibes" },
  { id:4, emoji:"🥣", label:"Sunday Egusi",        likes:156, category:"food"  },
  { id:5, emoji:"🍫", label:"Fresh Choco Bread",   likes:284, category:"food"  },
  { id:6, emoji:"👨‍🍳", label:"Chef at Work",   likes:421, category:"vibes" },
  { id:7, emoji:"🍹", label:"Evening Cocktails",   likes:198, category:"vibes" },
  { id:8, emoji:"🌯", label:"Shawarma Roll",        likes:167, category:"food"  },
  { id:9, emoji:"🎂", label:"Red Velvet Drop",     likes:302, category:"food"  },
];

const MEAL_PLANS = [
  { id:"starter", name:"Starter", price:42000, meals:5,  perWeek:1, badge:"Try it out",  color:C.sub,    bg:"#FAF7F0" },
  { id:"regular", name:"Regular", price:76000, meals:10, perWeek:2, badge:"Most Popular", color:"#E63939", bg:"#0F1A35" },
  { id:"premium", name:"Premium", price:120000,meals:20, perWeek:4, badge:"Best Value",   color:"#4CAF50", bg:"#0A1F18" },
];

const fmt = (n) => "₦" + Number(n).toLocaleString();

/* ─── FEATURE DATA ───────────────────────────────────────────────────────── */
const MOODS = [
  { id:"happy",    emoji:"😄", label:"Happy",    rec:[2,6,10], vibe:"Celebrate with a full feast!" },
  { id:"tired",    emoji:"😴", label:"Tired",    rec:[1,13,15], vibe:"Comfort food to recharge you." },
  { id:"stressed", emoji:"😤", label:"Stressed", rec:[3,15,12], vibe:"Light, calm bites to reset." },
  { id:"hungry",   emoji:"🤤", label:"Starving", rec:[2,6,8],  vibe:"Big bold portions, no holding back!" },
  { id:"healthy",  emoji:"💪", label:"Healthy",  rec:[6,13,3], vibe:"Clean fuel for your body." },
  { id:"spicy",    emoji:"🔥", label:"Spicy",    rec:[8,6,1],  vibe:"Turn up the heat!" },
];

const TASTE_QUESTIONS = [
  { id:"heat",  q:"How hot do you like it?",  opts:["Mild 😌","Medium 🌶","Fiery 🔥","Nuclear ☢️"] },
  { id:"base",  q:"Preferred base?",           opts:["Rice 🍚","Soup 🥣","Grilled 🍗","Pastry 🥧"] },
  { id:"time",  q:"When do you usually order?",opts:["Breakfast 🌅","Lunch 🌞","Dinner 🌙","Late Night 🌙"] },
  { id:"value", q:"What matters most?",        opts:["Portion size 📦","Health 🥗","Taste 😋","Value 💰"] },
];

const TASTE_PROFILES = {
  "heat=Fiery 🔥&base=Grilled 🍗":   { name:"The Grill King",     emoji:"🔥👑", desc:"Bold, charred, and unapologetically spicy. Suya is your love language." },
  "heat=Mild 😌&base=Rice 🍚":        { name:"The Comfort Seeker", emoji:"🍚💛", desc:"Warm, familiar, and satisfying. Ofada Rice was made for you." },
  "heat=Medium 🌶&base=Soup 🥣":      { name:"The Soup Whisperer", emoji:"🥣✨", desc:"Deep flavours, rich broths. You understand the soul of Nigerian cuisine." },
  default:                             { name:"The Food Explorer",  emoji:"🌍🍽", desc:"You love variety and adventure. Every meal is a new discovery." },
};

const NOTIF_FEED = [
  { id:1, icon:"✅", title:"Order Confirmed",      body:"TF-2024-083 is being prepared now.", time:"2 min ago",  read:false, type:"order"   },
  { id:2, icon:"🍗", title:"Your food is ready!",  body:"Come pick up or rider is on the way.", time:"15 min ago", read:false, type:"order"   },
  { id:3, icon:"⚡", title:"Flash Deal — 25% off", body:"Chocolate Bread deal ends in 22 mins.", time:"1 hr ago",  read:true,  type:"promo"   },
  { id:4, icon:"⭐", title:"You hit 2,000 points!", body:"Gold tier unlocked — claim your reward.", time:"3 hrs ago", read:true,  type:"reward"  },
  { id:5, icon:"🎁", title:"Gift Received!",        body:"Ngozi sent you Jollof + Chicken 🎉",   time:"1 day ago", read:true,  type:"gift"    },
  { id:6, icon:"👨‍🍳", title:"Chef's Weekly Special",body:"This week: Peppered Goat Stew. Limited!", time:"2 days ago",read:true, type:"special" },
];

const SOCIAL_FEED = [
  { id:1, user:"Amara O.",   avatar:"👩🏾", item:"Suya Chicken",             emoji:"🍢", time:"3 min ago",  joined:4,  comment:"This suya hits DIFFERENT 🔥" },
  { id:2, user:"Chidi N.",   avatar:"👨🏿", item:"Jollof Rice + Chicken",    emoji:"🍳", time:"12 min ago", joined:7,  comment:"Party rice on a Tuesday? Why not 😂" },
  { id:3, user:"Fatima A.",  avatar:"👩🏽", item:"Chocolate Bread",          emoji:"🍫", time:"28 min ago", joined:12, comment:"Freshly baked, still warm ❤️" },
  { id:4, user:"Yusuf B.",   avatar:"👨🏾", item:"Egusi Soup",               emoji:"🥣", time:"1 hr ago",   joined:3,  comment:"Exactly like mama's own." },
  { id:5, user:"Ngozi C.",   avatar:"👩🏿", item:"Grilled Chicken",          emoji:"🍗", time:"2 hrs ago",  joined:9,  comment:"Post-gym recovery sorted 💪" },
];

const WEEKLY_SPECIALS = [
  { id:1, name:"Peppered Goat Stew",    emoji:"🐐", price:5500, desc:"Slow-cooked tender goat in rich tomato & pepper sauce. This week only.", badge:"This Week", sold:34, total:50 },
  { id:2, name:"Afang Soup",            emoji:"🥬", price:4200, desc:"Premium Afang leaves with assorted seafood. Southern Nigerian classic.", badge:"Selling Fast", sold:28, total:40 },
  { id:3, name:"Oxtail Pepper Soup",    emoji:"🍖", price:6200, desc:"Bold, aromatic pepper soup with fall-off-the-bone oxtail. Chef's pride.", badge:"Chef Pick", sold:18, total:30 },
];

const GIFT_OCCASIONS = ["Birthday 🎂","Just Because 💛","Well Done 🏆","Get Well Soon 🌸","Thank You 🙏","Celebration 🎉"];

const CORP_PACKAGES = [
  { id:"lite",  name:"Team Lite",    price:45000, meals:10, freq:"Per order", badge:"",            desc:"Up to 10 meals, delivered to your office" },
  { id:"daily", name:"Daily Office", price:180000,meals:30, freq:"Per month", badge:"Most Popular",desc:"30 daily lunches, Mon–Fri, auto-scheduled" },
  { id:"exec",  name:"Executive",    price:320000,meals:60, freq:"Per month", badge:"Best Value",  desc:"60 meals/month, premium menu, priority prep" },
];

/* helper — all AI calls use the user's own key */
const callAI = async (apiKey, body) => {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json", "x-api-key": apiKey, "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, ...body })
  });
  return res.json();
};

/* ─── NEW DATA ───────────────────────────────────────────────────────────── */
const FOOD_STORIES = [
  { id:1, bg:"linear-gradient(135deg,#C0290A,#E63939)", emoji:"🍚", title:"Ofada Day!", body:"Every Friday we do extra-special Ofada sauce. Chef's secret recipe!", cta:"Order Now", screen:"menu" },
  { id:2, bg:"linear-gradient(135deg,#1B5E20,#4CAF50)", emoji:"🌿", title:"New: Salad Bowl", body:"Fresh garden salad with grilled chicken now available!", cta:"Try It", screen:"menu" },
  { id:3, bg:"linear-gradient(135deg,#C0290A,#FF5722)", emoji:"⚡", title:"Flash Deals Live!", body:"Up to 25% off selected items for the next hour only.", cta:"Grab Deal", screen:"flash" },
  { id:4, bg:"linear-gradient(135deg,#5C2800,#8D4E2A)", emoji:"🤖", title:"AI Chef is Ready", body:"Tell the AI your mood and it picks your perfect meal combo.", cta:"Try AI", screen:"aichat" },
  { id:5, bg:"linear-gradient(135deg,#1A0800,#A01A00)", emoji:"🎂", title:"Birthday Month?", body:"Get a FREE dessert on your birthday month with any ₦4k+ order.", cta:"Celebrate", screen:"birthday" },
];

const ORDER_STAGES = ["Confirmed","Preparing","Ready","On the Way","Delivered"];

/* streak data */
const STREAK_DATA = { current:7, longest:14, thisWeek:3 };

/* ─── CUSTOMER REVIEWS ───────────────────────────────────────────────────── */
const REVIEWS = [
  { id:1, name:"Amara O.",     avatar:"👩🏾",  rating:5, text:"The Ofada Rice is EVERYTHING. Best in Abuja by far — the Ayamase sauce is so rich and flavorful. I order it every Friday!", item:"Ofada Rice & Sauce",          date:"3 days ago",   verified:true  },
  { id:2, name:"Chukwuemeka", avatar:"👨🏿",  rating:5, text:"Suya Chicken hit different last night. That groundnut crust 🔥🔥 — spicy enough to feel alive, flavourful enough to keep eating.", item:"Suya Chicken",               date:"1 week ago",   verified:true  },
  { id:3, name:"Fatima A.",    avatar:"👩🏽",  rating:4, text:"Chocolate bread is freshly baked every morning and it shows. Warm, fudgy, pairs perfectly with a cold drink. My kids go crazy for it!", item:"Chocolate Bread",            date:"2 weeks ago",  verified:true  },
  { id:4, name:"Yusuf B.",     avatar:"👨🏾",  rating:5, text:"Placed a group order for 12 people — everything arrived hot and on time. The Jollof Rice had that smoky party taste. Will order again!", item:"Jollof Rice + Grilled Chicken", date:"5 days ago",  verified:true  },
  { id:5, name:"Ngozi C.",     avatar:"👩🏿",  rating:5, text:"The Egusi Soup is as authentic as my grandmother's. You can taste the care in every spoonful. The assorted meat portions are generous too.", item:"Egusi Soup",                 date:"1 week ago",   verified:false },
  { id:6, name:"Ibrahim T.",   avatar:"👨🏽",  rating:4, text:"Quick delivery, food was still warm on arrival. Grilled Chicken is perfectly seasoned. The app makes ordering so easy — love the AI chef feature!", item:"Grilled Chicken",            date:"4 days ago",   verified:true  },
];

/* ─── FOOD PREVIEWS ──────────────────────────────────────────────────────── */
const FOOD_PREVIEWS = [
  { id:1, menuId:1,  emoji:"🍚", name:"Ofada Rice & Sauce",        badge:"🏆 #1 Bestseller",  color:"linear-gradient(145deg,#7A1F00,#C0290A)", rating:4.9, orders:"2.4k orders",  highlight:"Rich Ayamase sauce with assorted meats" },
  { id:2, menuId:6,  emoji:"🍗", name:"Charcoal Grilled Chicken",  badge:"🔥 Chef's Special",  color:"linear-gradient(145deg,#1A0A00,#5C2800)", rating:4.8, orders:"1.8k orders",  highlight:"Marinated in 12 secret spices, charcoal-grilled" },
  { id:3, menuId:8,  emoji:"🍢", name:"Suya Chicken",              badge:"⚡ Hot & Spicy",     color:"linear-gradient(145deg,#C0290A,#FF5722)", rating:4.9, orders:"2.1k orders",  highlight:"Hausa-style with authentic suya spice blend" },
  { id:4, menuId:13, emoji:"🥣", name:"Egusi Soup",                badge:"🌿 Healthy Pick",    color:"linear-gradient(145deg,#1B5E20,#2E7D32)", rating:4.7, orders:"1.5k orders",  highlight:"Ground melon with palm oil & smoked fish" },
  { id:5, menuId:10, emoji:"🍫", name:"Chocolate Bread",           badge:"⭐ Daily Baked",     color:"linear-gradient(145deg,#3E1F00,#6D3B00)", rating:4.8, orders:"3.2k orders",  highlight:"Baked fresh every morning — warm & fudgy" },
  { id:6, menuId:2,  emoji:"🍳", name:"Jollof Rice + Chicken",     badge:"🎉 Party Style",     color:"linear-gradient(145deg,#8B1A0A,#C0290A)", rating:4.7, orders:"2.9k orders",  highlight:"Smoky party Jollof with grilled plantain" },
];

// Mock order history for wallet/dashboard
const ORDER_HISTORY = [
  { id:"TF-2024-081", date:"2025-07-18", items:["Jollof Rice + Grilled Chicken","Fresh Fruit Cocktail"], total:7700, status:"Delivered", rating:5 },
  { id:"TF-2024-080", date:"2025-07-15", items:["Ofada Rice & Sauce","Chocolate Bread"], total:7000, status:"Delivered", rating:4 },
  { id:"TF-2024-079", date:"2025-07-10", items:["Suya Chicken","Egusi Soup"], total:7700, status:"Delivered", rating:5 },
  { id:"TF-2024-078", date:"2025-07-06", items:["Grilled Chicken","Meat Pie"], total:5600, status:"Delivered", rating:4 },
  { id:"TF-2024-077", date:"2025-07-01", items:["Coconut Rice","Attieke & Fish"], total:8000, status:"Delivered", rating:5 },
];

/* ─── SHARED COMPONENTS ─────────────────────────────────────────────────── */
function Pill({ children, color=C.accent, bg=C.cream }) {
  return <span style={{ background:bg, color, borderRadius:99, padding:"3px 10px", fontSize:10, fontWeight:700, letterSpacing:0.3, whiteSpace:"nowrap" }}>{children}</span>;
}
function HRule() { return <div style={{ height:1, background:C.border }} />; }
function Tag({ text, color, bg }) {
  return <span style={{ fontSize:9, fontWeight:800, letterSpacing:0.8, textTransform:"uppercase", color, background:bg, borderRadius:6, padding:"2px 6px" }}>{text}</span>;
}
function BackBtn({ go, screen }) {
  return <button onClick={()=>go(screen||"home")} style={{ background:C.cream, border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", color:C.text, fontSize:18, marginBottom:14, display:"flex", alignItems:"center", justifyContent:"center" }}>←</button>;
}

/* ─── NUTRITION RING ─────────────────────────────────────────────────────── */
function NutritionRing({ cal, protein, carbs, fat, size=60 }) {
  const total = protein + carbs + fat || 1;
  const pP = (protein/total)*100, pC = (carbs/total)*100;
  const r = (size/2) - 6, circ = 2*Math.PI*r;
  const dP = (pP/100)*circ, dC = (pC/100)*circ, dF = circ - dP - dC;
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={5}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#66C24A" strokeWidth={5} strokeDasharray={`${dP} ${circ-dP}`} strokeDashoffset={0}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#60A5FA" strokeWidth={5} strokeDasharray={`${dC} ${circ-dC}`} strokeDashoffset={-dP}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F87171" strokeWidth={5} strokeDasharray={`${dF} ${circ-dF}`} strokeDashoffset={-(dP+dC)}/>
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:11, fontWeight:900, color:C.text, lineHeight:1 }}>{cal}</span>
        <span style={{ fontSize:7, color:C.sub, fontWeight:700 }}>kcal</span>
      </div>
    </div>
  );
}

/* ─── FLASH DEAL COUNTDOWN ──────────────────────────────────────────────── */
function FlashDealBanner({ go }) {
  const [secs, setSecs] = useState(3600-(new Date().getMinutes()*60+new Date().getSeconds()));
  useEffect(() => { const t=setInterval(()=>setSecs(s=>s<=1?3599:s-1),1000); return()=>clearInterval(t); }, []);
  const m=String(Math.floor((secs%3600)/60)).padStart(2,"0"), s=String(secs%60).padStart(2,"0");
  const deal=FLASH_DEALS[Math.floor(Date.now()/1000/3600)%FLASH_DEALS.length];
  const item=MENU.find(x=>x.id===deal.id);
  return (
    <div onClick={()=>go("flash")} style={{ margin:"16px 18px 0", background:"linear-gradient(135deg,#8B1A0A,#C0290A)", borderRadius:20, padding:"14px 18px", cursor:"pointer", overflow:"hidden", position:"relative", border:"1px solid #E6393944" }}>
      <div style={{ position:"absolute", right:-20, top:-20, width:100, height:100, borderRadius:"50%", background:`${C.accent}22` }}/>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
            <span style={{ fontSize:16 }}>⚡</span>
            <Pill bg={C.accent} color="#fff">FLASH DEAL</Pill>
            <Pill bg="rgba(255,255,255,0.12)" color="#fff">{deal.discount}% OFF</Pill>
          </div>
          <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:13 }}>{item?.name}</p>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {[m,s].map((v,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.1)", borderRadius:8, padding:"4px 8px", textAlign:"center" }}>
              <div style={{ color:C.accent2, fontSize:16, fontWeight:900, lineHeight:1 }}>{v}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:7 }}>{["MIN","SEC"][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NAV ───────────────────────────────────────────────────────────────── */
const NAV = [
  { id:"home",      svg:"M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",         label:"Home"   },
  { id:"menu",      svg:"M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z", label:"Menu"   },
  { id:"dashboard", svg:"M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z", label:"Wallet"  },
  { id:"reserve",   svg:"M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z", label:"Book"    },
  { id:"profile",   svg:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", label:"Me"      },
];

function NavIcon({ path, size=22, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d={path}/>
    </svg>
  );
}

function BottomNav({ active, go }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:420, background:"#FFFFFF", borderTop:"1px solid #EAE0D5", display:"flex", zIndex:100, paddingBottom:10, paddingTop:2, boxShadow:"0 -8px 32px rgba(0,0,0,0.07)" }}>
      {NAV.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => go(t.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", padding:"8px 0 2px", display:"flex", flexDirection:"column", alignItems:"center", gap:3 }}>
            <div style={{ width:44, height:32, borderRadius:16, background:on?"#E6393914":"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s" }}>
              <NavIcon path={t.svg} size={20} color={on?"#E63939":"#B0A090"}/>
            </div>
            <span style={{ fontSize:10, fontWeight:on?700:400, color:on?"#E63939":"#B0A090", fontFamily:"'DM Sans', system-ui, sans-serif", letterSpacing:0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── FOOD PREVIEW SECTION ───────────────────────────────────────────────── */
function FoodPreviewSection({ go, setCart }) {
  const [active, setActive] = useState(0);
  const prev = FOOD_PREVIEWS[active];
  const menuItem = MENU.find(m => m.id === prev.menuId);

  const addToCart = (item) => setCart(c => {
    const ex = c.find(x => x.id === item.id);
    return ex ? c.map(x => x.id === item.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...item, qty: 1 }];
  });

  return (
    <div style={{ marginTop: 26, padding: "0 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800, color: "#1A0A00", letterSpacing: -0.3 }}>Food Preview</p>
          <p style={{ margin: 0, fontSize: 11, color: "#7A6652", fontWeight: 500 }}>Tap a dish to explore · swipe to discover</p>
        </div>
        <button onClick={() => go("menu")} style={{ background: "none", border: "none", color: "#E63939", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Full Menu →</button>
      </div>

      {/* Thumbnail Row */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginBottom: 14 }}>
        {FOOD_PREVIEWS.map((fp, i) => (
          <button key={fp.id} onClick={() => setActive(i)} style={{ flexShrink: 0, width: 60, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: fp.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: i === active ? "2.5px solid #E63939" : "2.5px solid transparent", transition: "all 0.2s", boxShadow: i === active ? "0 4px 16px #E6393940" : "none" }}>
              {fp.emoji}
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 8.5, fontWeight: i === active ? 800 : 500, color: i === active ? "#E63939" : "#7A6652", textAlign: "center", lineHeight: 1.2 }}>{fp.name.split(" ")[0]}</p>
          </button>
        ))}
      </div>

      {/* Preview Card */}
      <div style={{ background: prev.color, borderRadius: 22, overflow: "hidden", boxShadow: "0 12px 36px rgba(0,0,0,0.18)", position: "relative", minHeight: 200 }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", right: -40, top: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", right: 20, bottom: -30, width: 90, height: 90, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ padding: "20px 20px 0", position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              {/* Badge */}
              <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.18)", borderRadius: 99, padding: "4px 10px", marginBottom: 10 }}>
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 0.4 }}>{prev.badge}</span>
              </div>
              <p style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 900, color: "#fff", lineHeight: 1.2, letterSpacing: -0.3 }}>{prev.name}</p>
              <p style={{ margin: "0 0 12px", fontSize: 11, color: "rgba(255,255,255,0.72)", lineHeight: 1.5 }}>{prev.highlight}</p>
            </div>
            <div style={{ fontSize: 68, lineHeight: 1, flexShrink: 0 }}>{prev.emoji}</div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.14)", borderRadius: 8, padding: "5px 10px" }}>
              <span style={{ color: "#FFC107", fontSize: 12 }}>⭐</span>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{prev.rating}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.14)", borderRadius: 8, padding: "5px 10px" }}>
              <span style={{ fontSize: 11 }}>🍽</span>
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{prev.orders}</span>
            </div>
            {menuItem && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.14)", borderRadius: 8, padding: "5px 10px" }}>
                <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>{fmt(menuItem.price)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Nutrition strip + CTA */}
        <div style={{ background: "rgba(0,0,0,0.28)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          {menuItem && (
            <div style={{ display: "flex", gap: 14, flex: 1 }}>
              {[
                { label: "Cal", value: menuItem.cal, color: "#FFC107" },
                { label: "Protein", value: `${menuItem.protein}g`, color: "#66C24A" },
                { label: "Carbs", value: `${menuItem.carbs}g`, color: "#60A5FA" },
              ].map(n => (
                <div key={n.label} style={{ textAlign: "center" }}>
                  <p style={{ margin: "0 0 1px", fontSize: 13, fontWeight: 900, color: n.color }}>{n.value}</p>
                  <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.55)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{n.label}</p>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => menuItem && addToCart(menuItem)} style={{ background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.35)", borderRadius: 12, padding: "10px 16px", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
            + Add to Cart
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 10 }}>
        {FOOD_PREVIEWS.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: i === active ? 20 : 6, height: 6, borderRadius: 99, background: i === active ? "#E63939" : "#D9CFC6", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}

/* ─── CUSTOMER REVIEWS ───────────────────────────────────────────────────── */
function CustomerReviews() {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);
  const avgRating = (REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length).toFixed(1);

  const filtered = filter === "all" ? REVIEWS : REVIEWS.filter(r => r.rating === parseInt(filter));

  const StarRow = ({ count, size = 13 }) => (
    <div style={{ display: "flex", gap: 1 }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ fontSize: size, color: s <= count ? "#FFC107" : "#D9CFC6" }}>★</span>
      ))}
    </div>
  );

  return (
    <div style={{ marginTop: 26, padding: "0 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ margin: "0 0 2px", fontSize: 16, fontWeight: 800, color: "#1A0A00", letterSpacing: -0.3 }}>Customer Reviews</p>
          <p style={{ margin: 0, fontSize: 11, color: "#7A6652", fontWeight: 500 }}>Real feedback from real diners</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: "#E63939", lineHeight: 1 }}>{avgRating}</p>
          <StarRow count={5} size={10} />
          <p style={{ margin: "2px 0 0", fontSize: 9, color: "#7A6652", fontWeight: 600 }}>{REVIEWS.length} reviews</p>
        </div>
      </div>

      {/* Rating summary bar */}
      <div style={{ background: "#FFFFFF", border: "1px solid #EAE0D5", borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <p style={{ margin: "0 0 4px", fontSize: 38, fontWeight: 900, color: "#1A0A00", lineHeight: 1 }}>{avgRating}</p>
            <StarRow count={5} size={14} />
            <p style={{ margin: "4px 0 0", fontSize: 10, color: "#7A6652", fontWeight: 600 }}>out of 5</p>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map(star => {
              const count = REVIEWS.filter(r => r.rating === star).length;
              const pct = Math.round((count / REVIEWS.length) * 100);
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#7A6652", width: 12 }}>{star}</span>
                  <span style={{ fontSize: 10, color: "#FFC107" }}>★</span>
                  <div style={{ flex: 1, height: 6, background: "#F5EFE8", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 60 ? "#E63939" : pct > 30 ? "#FFC107" : "#D9CFC6", borderRadius: 99, transition: "width 0.8s ease" }} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: "#7A6652", width: 22, textAlign: "right" }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", marginBottom: 14 }}>
        {[["all", "All"], ["5", "5 ★"], ["4", "4 ★"], ["3", "3 ★"]].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)} style={{ flexShrink: 0, background: filter === val ? "#E63939" : "#FFFFFF", border: `1.5px solid ${filter === val ? "#E63939" : "#EAE0D5"}`, borderRadius: 99, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: filter === val ? "#fff" : "#7A6652", cursor: "pointer", transition: "all 0.18s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div>
        {filtered.map(rev => {
          const isOpen = expanded === rev.id;
          return (
            <div key={rev.id} style={{ background: "#FFFFFF", border: "1px solid #EAE0D5", borderRadius: 18, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                {/* Avatar */}
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#FFF4EC,#FFE0CC)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                  {rev.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 13, color: "#1A0A00" }}>{rev.name}</span>
                      {rev.verified && (
                        <span style={{ background: "#F0FFF4", color: "#2E7D32", borderRadius: 6, padding: "1px 6px", fontSize: 8.5, fontWeight: 800 }}>✓ Verified</span>
                      )}
                    </div>
                    <span style={{ fontSize: 10, color: "#B0A090", fontWeight: 500 }}>{rev.date}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ display: "flex", gap: 1 }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <span key={s} style={{ fontSize: 11, color: s <= rev.rating ? "#FFC107" : "#D9CFC6" }}>★</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 9.5, color: "#7A6652", fontWeight: 600 }}>on {rev.item}</span>
                  </div>
                </div>
              </div>

              {/* Review text */}
              <p style={{ margin: "0 0 6px", fontSize: 12.5, color: "#4A3728", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: isOpen ? "unset" : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                "{rev.text}"
              </p>
              {rev.text.length > 80 && (
                <button onClick={() => setExpanded(isOpen ? null : rev.id)} style={{ background: "none", border: "none", color: "#E63939", fontSize: 11, fontWeight: 700, cursor: "pointer", padding: 0 }}>
                  {isOpen ? "Show less ↑" : "Read more ↓"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Leave a review CTA */}
      <div style={{ background: "linear-gradient(135deg,#FFF4EC,#FFE8D8)", border: "1.5px solid #FFD0B0", borderRadius: 18, padding: "16px 18px", display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 32 }}>✍️</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: "0 0 2px", fontWeight: 800, color: "#1A0A00", fontSize: 13 }}>Enjoyed your meal?</p>
          <p style={{ margin: 0, color: "#7A6652", fontSize: 11 }}>Leave a review & earn 50 loyalty points</p>
        </div>
        <button style={{ background: "linear-gradient(135deg,#C0290A,#E63939)", border: "none", borderRadius: 12, padding: "10px 14px", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", whiteSpace: "nowrap" }}>
          Rate Now ★
        </button>
      </div>
    </div>
  );
}

/* ─── 1. VOICE ORDERING ─────────────────────────────────────────────────── */
function VoiceOrderScreen({ go, setCart }) {
  const { apiKey } = useApiKey();
  const [phase, setPhase]     = useState("idle"); // idle | listening | thinking | done
  const [transcript, setTranscript] = useState("");
  const [result, setResult]   = useState(null);
  const [pulse, setPulse]     = useState(false);
  const timerRef = useRef(null);

  const QUICK_PHRASES = ["Order my usual","Something spicy please","Healthy option for lunch","Surprise me","Jollof and chicken","Suya and a drink"];

  const processOrder = async (text) => {
    setPhase("thinking");
    try {
      const data = await callAI(apiKey, {
        system:`You are a food ordering AI for Tasty Fingers restaurant. Menu items: ${MENU.map(m=>`${m.name} (₦${m.price})`).join(", ")}. 
Given a voice order request, return ONLY valid JSON: {"items":[{"id":number,"qty":number}],"message":"friendly confirmation message"}.
Match items by name similarity. Max 3 items. If unclear, pick best match.`,
        messages:[{ role:"user", content:text }]
      });
      const raw = data.content?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      const items = (parsed.items||[]).map(i=>({ ...MENU.find(m=>m.id===i.id), qty:i.qty||1 })).filter(Boolean);
      setResult({ items, message: parsed.message || "Here's what I found for you!" });
      setPhase("done");
    } catch(e) {
      setResult({ items:[], message:"Sorry, I couldn't process that. Try again!" });
      setPhase("done");
    }
  };

  const startListening = () => {
    setPhase("listening"); setPulse(true); setTranscript(""); setResult(null);
    // Simulate voice recognition with a 2-second demo
    timerRef.current = setTimeout(() => {
      const demo = QUICK_PHRASES[Math.floor(Math.random()*QUICK_PHRASES.length)];
      setTranscript(demo);
      setPulse(false);
      processOrder(demo);
    }, 2200);
  };

  const handleQuick = (phrase) => { setTranscript(phrase); processOrder(phrase); };

  const confirmCart = () => {
    if (!result?.items?.length) return;
    setCart(c => {
      let updated = [...c];
      result.items.forEach(item => {
        const ex = updated.find(x=>x.id===item.id);
        if (ex) updated = updated.map(x=>x.id===item.id?{...x,qty:x.qty+item.qty}:x);
        else updated.push({...item});
      });
      return updated;
    });
    go("cart");
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#1A0800,#3D1200)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🎙 Voice Order</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>Just say what you want — AI handles the rest</p>
      </div>

      <div style={{ padding:"24px 18px" }}>
        {/* Mic button */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
          <button onClick={phase==="idle"?startListening:undefined}
            style={{ width:120, height:120, borderRadius:"50%", border:"none", cursor:phase==="idle"?"pointer":"default",
              background: phase==="listening"?"linear-gradient(135deg,#E63939,#FF5722)":phase==="thinking"?"linear-gradient(135deg,#5C2800,#8D4E2A)":"linear-gradient(135deg,#C0290A,#E63939)",
              boxShadow: pulse?"0 0 0 20px #E6393920, 0 0 0 40px #E6393910":"0 8px 32px #E6393940",
              transition:"all 0.3s", fontSize:48, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {phase==="listening"?"🎙":phase==="thinking"?"⏳":phase==="done"?"✅":"🎙"}
          </button>
          <p style={{ margin:"16px 0 0", fontWeight:800, color:"#1A0A00", fontSize:15 }}>
            {phase==="idle"?"Tap to speak":phase==="listening"?"Listening…":phase==="thinking"?"Understanding your order…":"Got it!"}
          </p>
          {transcript && <p style={{ margin:"6px 0 0", color:"#7A6652", fontSize:13, fontStyle:"italic", textAlign:"center" }}>"{transcript}"</p>}
        </div>

        {/* Result */}
        {phase==="done" && result && (
          <div style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:20, padding:18, marginBottom:20 }}>
            <p style={{ margin:"0 0 14px", fontWeight:800, color:"#1A0A00", fontSize:15 }}>{result.message}</p>
            {result.items.map(item=>(
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12, padding:"10px 12px", background:"#FAF7F0", borderRadius:12 }}>
                <span style={{ fontSize:28 }}>{item.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{item.name}</p>
                  <p style={{ margin:0, color:"#E63939", fontWeight:700, fontSize:12 }}>{fmt(item.price)} × {item.qty}</p>
                </div>
              </div>
            ))}
            <div style={{ display:"flex", gap:10, marginTop:14 }}>
              <button onClick={()=>{setPhase("idle");setResult(null);}} style={{ flex:1, background:"#FFF4EC", border:"1.5px solid #EAE0D5", borderRadius:14, padding:"13px 0", color:"#7A6652", fontSize:13, fontWeight:800, cursor:"pointer" }}>Try Again</button>
              <button onClick={confirmCart} style={{ flex:2, background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:14, padding:"13px 0", color:"#fff", fontSize:13, fontWeight:900, cursor:"pointer" }}>Add to Cart →</button>
            </div>
          </div>
        )}

        {/* Quick phrases */}
        {phase==="idle" && (
          <>
            <p style={{ margin:"0 0 12px", fontWeight:800, color:"#1A0A00", fontSize:14 }}>Or try saying…</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {QUICK_PHRASES.map(p=>(
                <button key={p} onClick={()=>handleQuick(p)} style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:99, padding:"9px 16px", fontSize:12, fontWeight:700, color:"#4A3728", cursor:"pointer" }}>
                  "{p}"
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── 2. MOOD ORDERING ──────────────────────────────────────────────────── */
function MoodOrderScreen({ go, setCart }) {
  const [selected, setSelected] = useState(null);
  const mood = MOODS.find(m=>m.id===selected);
  const recs = mood ? mood.rec.map(id=>MENU.find(m=>m.id===id)).filter(Boolean) : [];

  const addToCart = (item) => setCart(c=>{
    const ex=c.find(x=>x.id===item.id);
    return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}];
  });

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#3D0A5C,#8D4E2A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🌈 Mood Ordering</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>How are you feeling? We'll pick the perfect dish.</p>
      </div>

      <div style={{ padding:"22px 18px" }}>
        <p style={{ margin:"0 0 16px", fontWeight:800, color:"#1A0A00", fontSize:15 }}>What's your vibe right now?</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {MOODS.map(m=>(
            <button key={m.id} onClick={()=>setSelected(m.id)}
              style={{ background:selected===m.id?"linear-gradient(135deg,#C0290A,#E63939)":"#FFFFFF",
                border:`2px solid ${selected===m.id?"#E63939":"#EAE0D5"}`, borderRadius:18, padding:"16px 8px",
                cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, transition:"all 0.2s",
                boxShadow:selected===m.id?"0 6px 20px #E6393940":"none" }}>
              <span style={{ fontSize:32 }}>{m.emoji}</span>
              <span style={{ fontSize:11, fontWeight:800, color:selected===m.id?"#fff":"#4A3728" }}>{m.label}</span>
            </button>
          ))}
        </div>

        {mood && (
          <>
            <div style={{ background:"linear-gradient(135deg,#FFF4EC,#FFE8D8)", border:"1.5px solid #FFD0B0", borderRadius:18, padding:"14px 16px", marginBottom:20 }}>
              <p style={{ margin:0, fontWeight:800, color:"#C0290A", fontSize:13 }}>✨ {mood.vibe}</p>
            </div>
            <p style={{ margin:"0 0 14px", fontWeight:800, color:"#1A0A00", fontSize:15 }}>Recommended for you</p>
            {recs.map(item=>(
              <div key={item.id} style={{ background:"#FFFFFF", border:"1px solid #EAE0D5", borderRadius:18, padding:"14px 16px", marginBottom:12, display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:56, height:56, borderRadius:14, background:"linear-gradient(135deg,#FFF4EC,#FFE8DC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{item.emoji}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{item.name}</p>
                  <p style={{ margin:"0 0 4px", color:"#7A6652", fontSize:11 }}>{item.cal} kcal · {item.protein}g protein</p>
                  <p style={{ margin:0, color:"#E63939", fontWeight:800, fontSize:14 }}>{fmt(item.price)}</p>
                </div>
                <button onClick={()=>addToCart(item)} style={{ background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:12, fontWeight:800, cursor:"pointer" }}>+ Add</button>
              </div>
            ))}
            <button onClick={()=>go("cart")} style={{ width:"100%", background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:16, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:8, boxShadow:"0 8px 24px #E6393940" }}>
              View Cart →
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── 3. TASTE DNA PROFILE ──────────────────────────────────────────────── */
function TasteDNAScreen({ go }) {
  const [step, setStep]       = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone]       = useState(false);

  const answer = (qid, opt) => {
    const updated = { ...answers, [qid]: opt };
    setAnswers(updated);
    if (step < TASTE_QUESTIONS.length - 1) setStep(s=>s+1);
    else setDone(true);
  };

  const profileKey = Object.entries(answers).slice(0,2).map(([k,v])=>`${k}=${v}`).join("&");
  const profile = TASTE_PROFILES[profileKey] || TASTE_PROFILES.default;
  const q = TASTE_QUESTIONS[step];

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#1A0A00,#5C1A00)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🧬 Taste DNA</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>Discover your unique food personality in 4 taps</p>
      </div>

      <div style={{ padding:"22px 18px" }}>
        {!done ? (
          <>
            {/* Progress */}
            <div style={{ display:"flex", gap:6, marginBottom:24 }}>
              {TASTE_QUESTIONS.map((_,i)=>(
                <div key={i} style={{ flex:1, height:4, borderRadius:99, background:i<=step?"#E63939":"#EAE0D5", transition:"background 0.3s" }}/>
              ))}
            </div>
            <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, color:"#B0A090", letterSpacing:1.5, textTransform:"uppercase" }}>Question {step+1} of {TASTE_QUESTIONS.length}</p>
            <p style={{ margin:"0 0 22px", fontSize:20, fontWeight:900, color:"#1A0A00", lineHeight:1.3 }}>{q.q}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {q.opts.map(opt=>(
                <button key={opt} onClick={()=>answer(q.id,opt)}
                  style={{ background:"#FFFFFF", border:"2px solid #EAE0D5", borderRadius:16, padding:"16px 20px", fontSize:14, fontWeight:700, color:"#1A0A00", cursor:"pointer", textAlign:"left", transition:"all 0.15s" }}>
                  {opt}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ background:"linear-gradient(135deg,#1A0A00,#C0290A)", borderRadius:24, padding:28, textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:64, marginBottom:12 }}>{profile.emoji}</div>
              <p style={{ margin:"0 0 6px", fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.55)", letterSpacing:2, textTransform:"uppercase" }}>Your Taste DNA</p>
              <p style={{ margin:"0 0 10px", fontSize:24, fontWeight:900, color:"#fff" }}>{profile.name}</p>
              <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:13, lineHeight:1.6 }}>{profile.desc}</p>
            </div>
            <div style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:18, padding:16, marginBottom:16 }}>
              <p style={{ margin:"0 0 12px", fontWeight:800, color:"#1A0A00", fontSize:14 }}>Your Flavour Profile</p>
              {Object.entries(answers).map(([k,v])=>{
                const q = TASTE_QUESTIONS.find(q=>q.id===k);
                return <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"#7A6652", fontSize:12 }}>{q?.q}</span>
                  <span style={{ fontWeight:800, color:"#1A0A00", fontSize:12 }}>{v}</span>
                </div>;
              })}
            </div>
            <button onClick={()=>{setDone(false);setStep(0);setAnswers({});}} style={{ width:"100%", background:"#FFF4EC", border:"1.5px solid #EAE0D5", borderRadius:14, padding:"14px 0", color:"#7A6652", fontSize:13, fontWeight:800, cursor:"pointer", marginBottom:10 }}>Retake Quiz</button>
            <button onClick={()=>go("menu")} style={{ width:"100%", background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>Explore Your Menu →</button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── 4. NOTIFICATIONS CENTER ───────────────────────────────────────────── */
function NotificationsScreen({ go }) {
  const [notifs, setNotifs] = useState(NOTIF_FEED);
  const [filter, setFilter] = useState("all");
  const unread = notifs.filter(n=>!n.read).length;

  const markAll = () => setNotifs(n=>n.map(x=>({...x,read:true})));
  const markOne = (id) => setNotifs(n=>n.map(x=>x.id===id?{...x,read:true}:x));
  const filtered = filter==="all"?notifs:notifs.filter(n=>n.type===filter);

  const typeColor = { order:"#E63939", promo:"#FFA000", reward:"#FFC107", gift:"#E63939", special:"#4CAF50" };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"#FFFFFF", padding:"20px 18px 14px", borderBottom:"1px solid #EAE0D5" }}>
        <BackBtn go={go} screen="home"/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:900, color:"#1A0A00" }}>🔔 Notifications</h2>
            {unread>0 && <p style={{ margin:0, color:"#E63939", fontSize:12, fontWeight:700 }}>{unread} unread</p>}
          </div>
          {unread>0 && <button onClick={markAll} style={{ background:"none", border:"none", color:"#E63939", fontSize:12, fontWeight:800, cursor:"pointer" }}>Mark all read</button>}
        </div>
      </div>

      <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none", padding:"14px 18px 0" }}>
        {[["all","All"],["order","Orders"],["promo","Promos"],["reward","Rewards"],["gift","Gifts"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{ flexShrink:0, background:filter===v?"#E63939":"#FFFFFF", border:`1.5px solid ${filter===v?"#E63939":"#EAE0D5"}`, borderRadius:99, padding:"7px 14px", fontSize:12, fontWeight:700, color:filter===v?"#fff":"#7A6652", cursor:"pointer" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:"14px 18px" }}>
        {filtered.map(n=>(
          <div key={n.id} onClick={()=>markOne(n.id)} style={{ background:n.read?"#FFFFFF":"#FFF8F5", border:`1.5px solid ${n.read?"#EAE0D5":"#FFD0C0"}`, borderRadius:16, padding:"14px 16px", marginBottom:10, cursor:"pointer", display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:42, height:42, borderRadius:12, background:n.read?"#F5EFE8":"#FFF0E8", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{n.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
                <p style={{ margin:0, fontWeight:n.read?700:900, color:"#1A0A00", fontSize:13 }}>{n.title}</p>
                {!n.read && <div style={{ width:8, height:8, borderRadius:"50%", background:"#E63939", flexShrink:0 }}/>}
              </div>
              <p style={{ margin:"0 0 4px", color:"#7A6652", fontSize:12, lineHeight:1.4 }}>{n.body}</p>
              <p style={{ margin:0, color:"#B0A090", fontSize:10, fontWeight:600 }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 5. SOCIAL DINING FEED ─────────────────────────────────────────────── */
function SocialFeedScreen({ go, setCart }) {
  const [joined, setJoined] = useState({});

  const joinOrder = (id, item) => {
    setJoined(j=>({...j,[id]:true}));
    setCart(c=>{
      const ex=c.find(x=>x.id===item.id);
      return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}];
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#0A1A3D,#1A3A8A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>👥 What Friends Ordered</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>See what's popular right now — join the order!</p>
      </div>

      <div style={{ padding:"18px 18px" }}>
        <div style={{ background:"linear-gradient(135deg,#FFF0E8,#FFE4CC)", border:"1.5px solid #FFD0B0", borderRadius:16, padding:"12px 16px", marginBottom:18, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>🔴</span>
          <p style={{ margin:0, fontWeight:800, color:"#C0290A", fontSize:12 }}>47 people are ordering right now · Kitchen is 🔥</p>
        </div>

        {SOCIAL_FEED.map(post=>{
          const menuItem = MENU.find(m=>m.name===post.item);
          const isJoined = joined[post.id];
          return (
            <div key={post.id} style={{ background:"#FFFFFF", border:"1px solid #EAE0D5", borderRadius:20, padding:"16px", marginBottom:14 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#FFF4EC,#FFE8DC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{post.avatar}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 1px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{post.user}</p>
                  <p style={{ margin:0, color:"#B0A090", fontSize:10 }}>just ordered · {post.time}</p>
                </div>
                <span style={{ fontSize:11, color:"#7A6652", fontWeight:700 }}>+{post.joined} joined</span>
              </div>

              <div style={{ background:"#FAF7F0", borderRadius:14, padding:"12px 14px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:32 }}>{post.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{post.item}</p>
                  {menuItem && <p style={{ margin:0, color:"#E63939", fontWeight:700, fontSize:12 }}>{fmt(menuItem.price)}</p>}
                </div>
              </div>

              <p style={{ margin:"0 0 12px", color:"#4A3728", fontSize:12, fontStyle:"italic" }}>"{post.comment}"</p>

              <button onClick={()=>menuItem&&joinOrder(post.id,menuItem)} disabled={isJoined}
                style={{ width:"100%", background:isJoined?"#4CAF50":"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:12, padding:"11px 0", color:"#fff", fontSize:13, fontWeight:800, cursor:isJoined?"default":"pointer", opacity:isJoined?0.85:1 }}>
                {isJoined?"✓ Joined the Order!":"👆 Join This Order"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 6. CHEF'S WEEKLY SPECIALS ─────────────────────────────────────────── */
function WeeklySpecialsScreen({ go, setCart }) {
  const addToCart = (item) => {
    const menuItem = { id:100+item.id, name:item.name, emoji:item.emoji, price:item.price, qty:1 };
    setCart(c=>{
      const ex=c.find(x=>x.id===menuItem.id);
      return ex?c.map(x=>x.id===menuItem.id?{...x,qty:x.qty+1}:x):[...c,menuItem];
    });
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#1B3A00,#2E7D32)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
          <h2 style={{ margin:0, color:"#fff", fontSize:24, fontWeight:900 }}>👨‍🍳 Chef's Table</h2>
          <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:8, padding:"3px 8px", fontSize:10, fontWeight:800 }}>WEEK 29</span>
        </div>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>Exclusive dishes dropped every Monday. App only.</p>
      </div>

      <div style={{ padding:"18px 18px" }}>
        <div style={{ background:"#FFF8E0", border:"1.5px solid #FFD54F", borderRadius:16, padding:"12px 16px", marginBottom:20, display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:20 }}>⏰</span>
          <p style={{ margin:0, color:"#7A5000", fontWeight:800, fontSize:12 }}>These dishes disappear Sunday night. Order before they're gone!</p>
        </div>

        {WEEKLY_SPECIALS.map(item=>{
          const pct = Math.round((item.sold/item.total)*100);
          return (
            <div key={item.id} style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:22, overflow:"hidden", marginBottom:16, boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}>
              <div style={{ background:"linear-gradient(135deg,#1B3A00,#388E3C)", padding:"18px 18px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div>
                    <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:6, padding:"2px 8px", fontSize:9, fontWeight:800, letterSpacing:0.8 }}>{item.badge}</span>
                    <p style={{ margin:"8px 0 4px", color:"#fff", fontWeight:900, fontSize:18 }}>{item.name}</p>
                    <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:11, lineHeight:1.5 }}>{item.desc}</p>
                  </div>
                  <span style={{ fontSize:52, flexShrink:0 }}>{item.emoji}</span>
                </div>
              </div>
              <div style={{ padding:"14px 18px" }}>
                <div style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:11, color:"#7A6652", fontWeight:700 }}>{item.sold} of {item.total} claimed</span>
                    <span style={{ fontSize:11, color:pct>80?"#E63939":"#4CAF50", fontWeight:800 }}>{100-pct}% left</span>
                  </div>
                  <div style={{ height:6, background:"#F5EFE8", borderRadius:99 }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:pct>80?"#E63939":"#4CAF50", borderRadius:99 }}/>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <p style={{ margin:0, fontWeight:900, color:"#E63939", fontSize:20 }}>{fmt(item.price)}</p>
                  <button onClick={()=>addToCart(item)} style={{ background:"linear-gradient(135deg,#1B3A00,#388E3C)", border:"none", borderRadius:12, padding:"11px 20px", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── 7. MEAL GIFTING ───────────────────────────────────────────────────── */
function GiftMealScreen({ go }) {
  const [step, setStep]       = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const [occasion, setOccasion] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [note, setNote]       = useState("");
  const [done, setDone]       = useState(false);

  const popular = MENU.filter(m=>m.popular);

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ fontSize:80, marginBottom:16 }}>🎁</div>
      <h2 style={{ margin:"0 0 8px", fontWeight:900, color:"#1A0A00", fontSize:24, textAlign:"center" }}>Gift Sent!</h2>
      <p style={{ margin:"0 0 6px", color:"#7A6652", fontSize:14, textAlign:"center", lineHeight:1.6 }}>
        {recipientName} will receive an in-app notification about their meal gift from you!
      </p>
      <div style={{ background:"#FFF4EC", border:"1.5px solid #FFD0B0", borderRadius:18, padding:18, width:"100%", marginTop:20, marginBottom:24 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <span style={{ fontSize:36 }}>{selectedItem?.emoji}</span>
          <div>
            <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:14 }}>{selectedItem?.name}</p>
            <p style={{ margin:0, color:"#E63939", fontWeight:700, fontSize:13 }}>Gifted to {recipientName} · {occasion}</p>
          </div>
        </div>
      </div>
      <button onClick={()=>go("home")} style={{ width:"100%", background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:16, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>Back to Home</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#7A0050,#C0006A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🎁 Gift a Meal</h2>
        <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.65)", fontSize:12 }}>Send food to someone you love — they order, you pay.</p>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3].map(s=><div key={s} style={{ flex:1, height:4, borderRadius:99, background:s<=step?"#fff":"rgba(255,255,255,0.25)" }}/>)}
        </div>
      </div>

      <div style={{ padding:"22px 18px" }}>
        {step===1 && (
          <>
            <p style={{ margin:"0 0 16px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>Pick a dish to gift</p>
            {popular.map(item=>(
              <div key={item.id} onClick={()=>setSelectedItem(item)}
                style={{ background:"#FFFFFF", border:`2px solid ${selectedItem?.id===item.id?"#E63939":"#EAE0D5"}`, borderRadius:18, padding:"14px 16px", marginBottom:10, cursor:"pointer", display:"flex", alignItems:"center", gap:12, transition:"all 0.2s" }}>
                <span style={{ fontSize:32 }}>{item.emoji}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{item.name}</p>
                  <p style={{ margin:0, color:"#E63939", fontWeight:700, fontSize:13 }}>{fmt(item.price)}</p>
                </div>
                {selectedItem?.id===item.id && <span style={{ color:"#E63939", fontSize:20 }}>✓</span>}
              </div>
            ))}
          </>
        )}

        {step===2 && (
          <>
            <p style={{ margin:"0 0 16px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>What's the occasion?</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              {GIFT_OCCASIONS.map(o=>(
                <button key={o} onClick={()=>setOccasion(o)} style={{ background:occasion===o?"#E63939":"#FFFFFF", border:`1.5px solid ${occasion===o?"#E63939":"#EAE0D5"}`, borderRadius:99, padding:"9px 14px", fontSize:12, fontWeight:700, color:occasion===o?"#fff":"#4A3728", cursor:"pointer" }}>{o}</button>
              ))}
            </div>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>Recipient Details</p>
            {[
              { label:"Recipient Name", val:recipientName, set:setRecipientName, ph:"Their first name" },
              { label:"Phone Number",   val:recipientPhone, set:setRecipientPhone, ph:"+234 800 000 0000" },
            ].map(f=>(
              <div key={f.label} style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:14, padding:14, marginBottom:12 }}>
                <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:"#7A6652", letterSpacing:1.5, textTransform:"uppercase" }}>{f.label}</p>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ background:"none", border:"none", outline:"none", color:"#1A0A00", fontSize:15, fontWeight:700, width:"100%" }}/>
              </div>
            ))}
          </>
        )}

        {step===3 && (
          <>
            <p style={{ margin:"0 0 16px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>Add a personal note</p>
            <div style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:14, padding:14, marginBottom:16 }}>
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Write a message… e.g. 'Happy Birthday! Enjoy your meal 🎉'" rows={4}
                style={{ background:"none", border:"none", outline:"none", color:"#1A0A00", fontSize:14, fontWeight:500, width:"100%", resize:"none", lineHeight:1.6 }}/>
            </div>
            <div style={{ background:"#FAF7F0", border:"1.5px solid #EAE0D5", borderRadius:16, padding:16, marginBottom:14 }}>
              <p style={{ margin:"0 0 10px", fontWeight:800, color:"#7A6652", fontSize:10, letterSpacing:1.5, textTransform:"uppercase" }}>Gift Summary</p>
              {[["Dish",selectedItem?.name||"—"],["To",recipientName||"—"],["Occasion",occasion||"—"],["Total",fmt(selectedItem?.price||0)]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:"#7A6652", fontSize:12 }}>{l}</span>
                  <span style={{ fontWeight:800, color:"#1A0A00", fontSize:12 }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:10, marginTop:8 }}>
          {step>1 && <button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:"#FFF4EC", border:"1.5px solid #EAE0D5", borderRadius:14, padding:"15px 0", color:"#7A6652", fontSize:13, fontWeight:800, cursor:"pointer" }}>← Back</button>}
          <button onClick={()=>{if(step<3)setStep(s=>s+1);else setDone(true);}}
            disabled={step===1&&!selectedItem || step===2&&(!occasion||!recipientName)}
            style={{ flex:2, background:"linear-gradient(135deg,#7A0050,#C0006A)", border:"none", borderRadius:14, padding:"15px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", opacity:(step===1&&!selectedItem)||(step===2&&(!occasion||!recipientName))?0.5:1 }}>
            {step<3?"Continue →":"Send Gift 🎁"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── 8. CORPORATE ORDERS ───────────────────────────────────────────────── */
function CorporateScreen({ go }) {
  const [selected, setSelected] = useState("daily");
  const [company, setCompany]   = useState("");
  const [contact, setContact]   = useState("");
  const [email, setEmail]       = useState("");
  const [done, setDone]         = useState(false);
  const pkg = CORP_PACKAGES.find(p=>p.id===selected);

  if (done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:28 }}>
      <div style={{ fontSize:70 }}>🏢</div>
      <h2 style={{ margin:"12px 0 8px", fontWeight:900, color:"#1A0A00", fontSize:22, textAlign:"center" }}>Enquiry Submitted!</h2>
      <p style={{ margin:"0 0 24px", color:"#7A6652", fontSize:13, textAlign:"center", lineHeight:1.7 }}>Our corporate team will reach out within 2 business hours to set up your account and first delivery.</p>
      <button onClick={()=>go("home")} style={{ width:"100%", background:"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:16, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>Back to Home</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#0A1A3D,#1A3A8A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🏢 Corporate Orders</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.65)", fontSize:12 }}>Fuel your team — daily office lunches, auto-scheduled.</p>
      </div>

      <div style={{ padding:"20px 18px" }}>
        <p style={{ margin:"0 0 14px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>Choose a package</p>
        {CORP_PACKAGES.map(p=>(
          <div key={p.id} onClick={()=>setSelected(p.id)}
            style={{ background:selected===p.id?"linear-gradient(135deg,#0A1A3D,#1A3A8A)":"#FFFFFF",
              border:`2px solid ${selected===p.id?"#1A3A8A":"#EAE0D5"}`, borderRadius:20, padding:"16px 18px", marginBottom:12, cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
              <div>
                {p.badge && <span style={{ background:"rgba(255,215,0,0.2)", color:selected===p.id?"#FFD700":"#7A5000", borderRadius:6, padding:"2px 8px", fontSize:9, fontWeight:800, marginBottom:6, display:"inline-block" }}>{p.badge}</span>}
                <p style={{ margin:"4px 0 2px", fontWeight:900, color:selected===p.id?"#fff":"#1A0A00", fontSize:16 }}>{p.name}</p>
                <p style={{ margin:0, color:selected===p.id?"rgba(255,255,255,0.7)":"#7A6652", fontSize:11 }}>{p.desc}</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:selected===p.id?"#fff":"#E63939", fontSize:18 }}>{fmt(p.price)}</p>
                <p style={{ margin:0, color:selected===p.id?"rgba(255,255,255,0.55)":"#B0A090", fontSize:10 }}>{p.freq}</p>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {[`${p.meals} meals`,p.freq].map(tag=>(
                <span key={tag} style={{ background:selected===p.id?"rgba(255,255,255,0.15)":"#F5EFE8", color:selected===p.id?"#fff":"#7A6652", borderRadius:8, padding:"4px 10px", fontSize:10, fontWeight:700 }}>{tag}</span>
              ))}
            </div>
          </div>
        ))}

        <p style={{ margin:"20px 0 14px", fontWeight:900, color:"#1A0A00", fontSize:15 }}>Company Details</p>
        {[
          { label:"Company Name", val:company, set:setCompany, ph:"e.g. Zenith Bank PLC" },
          { label:"Contact Person", val:contact, set:setContact, ph:"Full name" },
          { label:"Work Email",    val:email,   set:setEmail,   ph:"you@company.com" },
        ].map(f=>(
          <div key={f.label} style={{ background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:14, padding:14, marginBottom:12 }}>
            <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:"#7A6652", letterSpacing:1.5, textTransform:"uppercase" }}>{f.label}</p>
            <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ background:"none", border:"none", outline:"none", color:"#1A0A00", fontSize:14, fontWeight:700, width:"100%" }}/>
          </div>
        ))}

        <div style={{ background:"#EAF3DE", border:"1.5px solid #C0DD97", borderRadius:14, padding:"12px 16px", marginBottom:16, display:"flex", gap:10, alignItems:"flex-start" }}>
          <span style={{ fontSize:18 }}>✅</span>
          <p style={{ margin:0, color:"#3B6D11", fontSize:12, fontWeight:700, lineHeight:1.5 }}>Monthly invoicing · Dedicated account manager · Priority prep · Free delivery on all orders</p>
        </div>

        <button onClick={()=>{if(company&&contact&&email)setDone(true);}}
          style={{ width:"100%", background:"linear-gradient(135deg,#0A1A3D,#1A3A8A)", border:"none", borderRadius:16, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", opacity:company&&contact&&email?1:0.5 }}>
          Submit Enquiry →
        </button>
      </div>
    </div>
  );
}

/* ─── HOME SCREEN ───────────────────────────────────────────────────────── */
function HomeScreen({ go, cart, setCart }) {
  const [slide, setSlide] = useState(0);
  const popular = MENU.filter(m=>m.popular);
  const totalQty = cart.reduce((a,i)=>a+i.qty,0);
  const feat = popular[slide];

  useEffect(() => {
    const t=setInterval(()=>setSlide(s=>(s+1)%popular.length),3400);
    return()=>clearInterval(t);
  },[]);

  const addToCart = (item) => setCart(c=>{
    const ex=c.find(x=>x.id===item.id);
    return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}];
  });

  const quickLinks = [
    { icon:"🎙", label:"Voice Order",  screen:"voice",    bg:"#FFF0E8", color:"#C0290A" },
    { icon:"🌈", label:"Mood Order",   screen:"mood",     bg:"#F3E5F5", color:"#6A1B9A" },
    { icon:"🤖", label:"AI Chef",      screen:"aichat",   bg:"#FFF0E8", color:"#C0290A" },
    { icon:"⚡", label:"Flash Deals",  screen:"flash",    bg:"#FFF3E0", color:"#E65100" },
    { icon:"👥", label:"Social Feed",  screen:"social",   bg:"#E3F2FD", color:"#0D47A1" },
    { icon:"👨‍🍳", label:"Chef's Table",screen:"specials", bg:"#F1F8E9", color:"#1B5E20" },
    { icon:"🎁", label:"Gift a Meal",  screen:"gift",     bg:"#FCE4EC", color:"#880E4F" },
    { icon:"🏢", label:"Corporate",    screen:"corp",     bg:"#E8EAF6", color:"#1A237E" },
    { icon:"📋", label:"Meal Plan",    screen:"mealplan", bg:"#F0FFF4", color:"#1B5E20" },
    { icon:"🧬", label:"Taste DNA",    screen:"tasteDNA", bg:"#FFF3E0", color:"#BF360C" },
    { icon:"🛵", label:"Track Order",  screen:"tracker",  bg:"#E8F5E9", color:"#1B5E20" },
    { icon:"🔥", label:"My Streak",    screen:"streak",   bg:"#FFF8E1", color:"#E65100" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90, fontFamily:"'DM Sans', system-ui, sans-serif" }}>

      {/* ── HEADER ── */}
      <div style={{ background:"#FFFFFF", padding:"18px 20px 14px", boxShadow:"0 1px 0 #EAE0D5" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:2 }}>
              <div style={{ width:28, height:28, borderRadius:8, background:"linear-gradient(135deg,#C0290A,#E63939)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🍽</div>
              <span style={{ fontSize:13, fontWeight:600, color:"#B0A090", letterSpacing:0.5, textTransform:"uppercase" }}>Tasty Fingers</span>
            </div>
            <p style={{ margin:0, fontSize:24, fontWeight:800, color:"#1A0A00", lineHeight:1.2, letterSpacing:-0.5 }}>{(()=>{const h=new Date().getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening";})()}, <span style={{ color:"#E63939" }}>Adaeze</span> 👋</p>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button onClick={()=>go("notifications")} style={{ background:"#FFF0E8", border:"none", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, position:"relative" }}>
              🔔
              <span style={{ position:"absolute", top:6, right:7, width:8, height:8, borderRadius:"50%", background:"#E63939", border:"2px solid #FAF7F0" }}/>
            </button>
            <button onClick={()=>go("aichat")} style={{ background:"#FFF0E8", border:"none", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🤖</button>
            <button onClick={()=>go("cart")} style={{ background:"#E63939", border:"none", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", boxShadow:"0 4px 12px #E6393940" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59L5.25 14c-.16.28-.25.61-.25.96C5 16.1 5.9 17 7 17h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0023.54 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
              {totalQty>0&&<span style={{ position:"absolute", top:-5, right:-5, background:"#FFC107", color:"#1A0A00", borderRadius:99, width:18, height:18, fontSize:9, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center" }}>{totalQty}</span>}
            </button>
          </div>
        </div>
        {/* Location pill */}
        <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:10, background:"#FAF7F0", border:"1px solid #EAE0D5", borderRadius:99, padding:"6px 12px", width:"fit-content", cursor:"pointer" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#E63939"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/></svg>
          <span style={{ fontSize:11, color:"#7A6652", fontWeight:600 }}>Metta Mall, Abuja</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#B0A090"><path d="M7 10l5 5 5-5z"/></svg>
        </div>
      </div>

      {/* ── WALLET STRIP ── */}
      <div onClick={()=>go("dashboard")} style={{ margin:"16px 18px 0", background:"linear-gradient(135deg,#1A0800,#C0290A,#E63939)", borderRadius:20, padding:"16px 18px", cursor:"pointer", display:"flex", alignItems:"center", gap:14, boxShadow:"0 8px 24px #E6393930" }}>
        <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(4px)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M21 18v1c0 1.1-.9 2-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14c1.1 0 2 .9 2 2v1h-9a2 2 0 00-2 2v8a2 2 0 002 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <p style={{ margin:"0 0 1px", color:"rgba(255,255,255,0.65)", fontSize:10, fontWeight:600, letterSpacing:1.2, textTransform:"uppercase" }}>Tasty Wallet</p>
          <p style={{ margin:0, color:"#fff", fontWeight:800, fontSize:22, letterSpacing:-0.5 }}>₦25,000.00</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.55)", fontSize:10, fontWeight:500 }}>Points</p>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:14 }}>⭐</span>
            <span style={{ color:"#FFC107", fontWeight:800, fontSize:16 }}>1,840</span>
          </div>
        </div>
      </div>

      {/* ── KITCHEN STATUS ── */}
      <div onClick={()=>go("queue")} style={{ margin:"10px 18px 0", background:"#FFFFFF", border:"1px solid #EAE0D5", borderRadius:16, padding:"11px 14px", display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
        <div style={{ width:8, height:8, borderRadius:"50%", background:"#4CAF50", boxShadow:"0 0 6px #4CAF5088", flexShrink:0 }}/>
        <div style={{ flex:1 }}>
          <span style={{ fontWeight:700, color:"#1A0A00", fontSize:13 }}>Kitchen Open</span>
          <span style={{ color:"#B0A090", fontSize:12, marginLeft:6 }}>· 20–35 min wait · 8 ahead</span>
        </div>
        <span style={{ fontSize:12, color:"#E63939", fontWeight:700 }}>Join Queue →</span>
      </div>

      {/* ── FLASH DEAL ── */}
      <FlashDealBanner go={go} />

      {/* ── FOOD STORIES ── */}
      <FoodStoriesBanner go={go}/>

      {/* ── HERO CAROUSEL ── */}
      <div style={{ margin:"18px 18px 0" }}>
        <div style={{ background:"linear-gradient(135deg,#8B1A0A,#C0290A,#E63939)", borderRadius:24, padding:"20px", position:"relative", overflow:"hidden", minHeight:180, boxShadow:"0 12px 32px #E6393930" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
          <div style={{ position:"absolute", right:40, bottom:-20, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.18)", borderRadius:99, padding:"4px 10px 4px 6px", marginBottom:10 }}>
            <span style={{ fontSize:10 }}>🏆</span>
            <span style={{ color:"#fff", fontSize:10, fontWeight:700, letterSpacing:0.5 }}>TODAY'S PICK</span>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 3px", fontSize:21, fontWeight:800, color:"#fff", lineHeight:1.2, letterSpacing:-0.3 }}>{feat?.name}</p>
              <p style={{ margin:"0 0 14px", color:"rgba(255,255,255,0.7)", fontSize:11 }}>{feat?.ingredients?.slice(0,3).join(" · ")}</p>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <p style={{ margin:0, color:"#fff", fontWeight:800, fontSize:20 }}>{fmt(feat?.price)}</p>
                <button onClick={()=>{addToCart(feat);}} style={{ background:"rgba(255,255,255,0.22)", border:"1px solid rgba(255,255,255,0.35)", borderRadius:99, padding:"7px 16px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ Add to cart</button>
              </div>
            </div>
            <div style={{ fontSize:64 }}>{feat?.emoji}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:5, justifyContent:"center", marginTop:10 }}>
          {popular.map((_,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{ width:i===slide?24:6, height:6, borderRadius:99, background:i===slide?"#E63939":"#D9CFC6", cursor:"pointer", transition:"all 0.3s ease" }}/>
          ))}
        </div>
      </div>

      {/* ── QUICK ACCESS — horizontal scroll pills ── */}
      <div style={{ marginTop:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px", marginBottom:12 }}>
          <p style={{ margin:0, fontSize:16, fontWeight:800, color:"#1A0A00", letterSpacing:-0.3 }}>Quick Access</p>
        </div>
        <div style={{ display:"flex", gap:10, overflowX:"auto", scrollbarWidth:"none", padding:"0 18px 4px" }}>
          {quickLinks.map(q=>(
            <button key={q.screen} onClick={()=>go(q.screen)} style={{ flexShrink:0, background:"#FFFFFF", border:"1.5px solid #EAE0D5", borderRadius:16, padding:"12px 14px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:7, minWidth:72, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.15s" }}>
              <div style={{ width:40, height:40, borderRadius:12, background:q.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{q.icon}</div>
              <span style={{ fontSize:10, fontWeight:600, color:"#4A3728", textAlign:"center", lineHeight:1.3, whiteSpace:"nowrap" }}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── SMART REORDER ── */}
      <SmartReorderCard setCart={setCart}/>

      {/* ── FAN FAVOURITES ── */}
      <div style={{ marginTop:22 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 18px", marginBottom:12 }}>
          <p style={{ margin:0, fontSize:16, fontWeight:800, color:"#1A0A00", letterSpacing:-0.3 }}>Fan Favourites</p>
          <button onClick={()=>go("menu")} style={{ background:"none", border:"none", color:"#E63939", fontSize:13, fontWeight:700, cursor:"pointer" }}>See all →</button>
        </div>
        <div style={{ display:"flex", gap:12, overflowX:"auto", scrollbarWidth:"none", padding:"0 18px 4px" }}>
          {MENU.filter(m=>m.popular).map(item=>{
            const inCart = cart.find(x=>x.id===item.id);
            return (
              <div key={item.id} style={{ background:"#FFFFFF", border:"1px solid #EAE0D5", borderRadius:20, padding:"14px 14px 12px", minWidth:155, flexShrink:0, boxShadow:"0 2px 10px rgba(0,0,0,0.05)" }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(135deg,#FFF4EC,#FFE8DC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, marginBottom:10 }}>{item.emoji}</div>
                {item.tag&&<div style={{ display:"inline-flex", alignItems:"center", gap:3, background:"#FFF4EC", borderRadius:6, padding:"2px 7px", marginBottom:5 }}><span style={{ fontSize:9, fontWeight:700, color:"#E63939" }}>{item.tag}</span></div>}
                <p style={{ margin:"0 0 2px", fontWeight:700, color:"#1A0A00", fontSize:13, lineHeight:1.3 }}>{item.name}</p>
                <p style={{ margin:"0 0 10px", color:"#E63939", fontWeight:800, fontSize:14 }}>{fmt(item.price)}</p>
                <button onClick={()=>addToCart(item)} style={{ width:"100%", background:inCart?"#E63939":"linear-gradient(135deg,#C0290A,#E63939)", border:"none", borderRadius:10, padding:"9px 0", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", boxShadow:inCart?"none":"0 4px 10px #E6393930" }}>
                  {inCart?`✓ In Cart (${inCart.qty})`:"Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LOCATIONS ── */}
      <div style={{ padding:"22px 18px 0" }}>
        <p style={{ margin:"0 0 12px", fontSize:16, fontWeight:800, color:"#1A0A00", letterSpacing:-0.3 }}>Our Locations</p>
        <div style={{ display:"flex", gap:10 }}>
          {LOCATIONS.map(loc=>(
            <div key={loc.id} style={{ flex:1, background:"#FFFFFF", border:"1px solid #EAE0D5", borderRadius:18, padding:"14px 12px", boxShadow:"0 2px 8px rgba(0,0,0,0.04)" }}>
              <div style={{ width:34, height:34, borderRadius:10, background:"linear-gradient(135deg,#C0290A,#E63939)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginBottom:8 }}>📍</div>
              <p style={{ margin:"0 0 2px", fontWeight:800, color:"#1A0A00", fontSize:13 }}>{loc.name}</p>
              <p style={{ margin:"0 0 6px", color:"#7A6652", fontSize:10, lineHeight:1.5 }}>{loc.address}</p>
              <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"#F0FFF4", borderRadius:6, padding:"3px 7px" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50" }}/>
                <span style={{ fontSize:9, fontWeight:700, color:"#2E7D32" }}>{loc.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOD PREVIEW ── */}
      <FoodPreviewSection go={go} setCart={setCart}/>

      {/* ── CUSTOMER REVIEWS ── */}
      <CustomerReviews/>

    </div>
  );
}

/* ─── WALLET / DASHBOARD ────────────────────────────────────────────────── */
function DashboardScreen({ go }) {
  const [tab, setTab] = useState("overview");
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmt, setTopupAmt] = useState("");
  const [balance, setBalance] = useState(25000);
  const [transactions] = useState([
    { id:1, type:"credit",  label:"Wallet Top-up",          amount:10000, date:"Today, 2:14 PM",    icon:"💳" },
    { id:2, type:"debit",   label:"Jollof Rice + Cocktail",  amount:7700,  date:"Jul 18, 12:30 PM",  icon:"🍚" },
    { id:3, type:"credit",  label:"Loyalty Cashback",        amount:500,   date:"Jul 18, 12:31 PM",  icon:"🎁" },
    { id:4, type:"debit",   label:"Ofada + Choco Bread",     amount:7000,  date:"Jul 15, 1:10 PM",   icon:"🍚" },
    { id:5, type:"debit",   label:"Suya + Egusi",            amount:7700,  date:"Jul 10, 7:45 PM",   icon:"🍗" },
    { id:6, type:"credit",  label:"Referral Bonus",          amount:2000,  date:"Jul 8, 9:00 AM",    icon:"👥" },
    { id:7, type:"debit",   label:"Grilled Chicken",         amount:4800,  date:"Jul 6, 1:15 PM",    icon:"🍗" },
    { id:8, type:"credit",  label:"Birthday Bonus",          amount:1500,  date:"Jul 1, 8:00 AM",    icon:"🎂" },
  ]);

  const totalSpent = transactions.filter(t=>t.type==="debit").reduce((a,t)=>a+t.amount,0);
  const totalSaved = transactions.filter(t=>t.type==="credit").reduce((a,t)=>a+t.amount,0);
  const points = 1840;
  const nextTier = 3000;

  // Spending by category
  const spendData = [
    { label:"Restaurant", pct:45, color:C.accent },
    { label:"Grill",      pct:30, color:C.accent2 },
    { label:"Bakery",     pct:15, color:C.gold },
    { label:"Drinks",     pct:10, color:C.green },
  ];

  const TOPUP_AMOUNTS = [5000,10000,20000,50000];

  const doTopup = () => {
    const amt = parseInt(topupAmt);
    if(!amt||amt<500) return;
    setBalance(b=>b+amt);
    setShowTopup(false);
    setTopupAmt("");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(160deg,#7A0A00,#B01E0A,#E63939)", padding:"24px 18px 32px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute", left:-20, bottom:-40, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, position:"relative" }}>
          <div>
            <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.65)", fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:"uppercase" }}>Tasty Wallet</p>
            <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:32, letterSpacing:-0.5 }}>{fmt(balance)}</p>
          </div>
          <div style={{ width:52, height:52, borderRadius:16, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>💳</div>
        </div>
        <div style={{ display:"flex", gap:10, position:"relative" }}>
          <button onClick={()=>setShowTopup(true)} style={{ flex:1, background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:14, padding:"12px 0", color:"#fff", fontSize:13, fontWeight:900, cursor:"pointer" }}>+ Top Up</button>
          <button onClick={()=>go("menu")} style={{ flex:1, background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:14, padding:"12px 0", color:"#fff", fontSize:13, fontWeight:900, cursor:"pointer" }}>🍽 Order Now</button>
          <button onClick={()=>go("split")} style={{ flex:1, background:"rgba(255,255,255,0.2)", border:"1.5px solid rgba(255,255,255,0.3)", borderRadius:14, padding:"12px 0", color:"#fff", fontSize:13, fontWeight:900, cursor:"pointer" }}>🧮 Split Bill</button>
        </div>
      </div>

      {/* Loyalty Points Bar */}
      <div style={{ margin:"16px 18px 0", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>⭐</span>
            <div>
              <p style={{ margin:"0 0 1px", fontWeight:900, color:C.text, fontSize:14 }}>Silver Member</p>
              <p style={{ margin:0, color:C.sub, fontSize:11 }}>{points.toLocaleString()} pts · {(nextTier-points).toLocaleString()} to Gold</p>
            </div>
          </div>
          <Pill bg="#FFFBF0" color={C.gold}>🏅 Silver</Pill>
        </div>
        <div style={{ height:8, background:C.cream, borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${(points/nextTier)*100}%`, background:"linear-gradient(90deg,#E63939,#8D4E2A)", borderRadius:99, transition:"width 1s ease" }}/>
        </div>
        <p style={{ margin:"6px 0 0", color:C.sub, fontSize:10 }}>{(nextTier-points).toLocaleString()} pts to unlock Gold benefits</p>
      </div>

      {/* Stats Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, margin:"12px 18px 0" }}>
        {[
          { icon:"🍽", label:"Orders",    value:ORDER_HISTORY.length, sub:"Total" },
          { icon:"💸", label:"Spent",     value:fmt(totalSpent),      sub:"All time" },
          { icon:"🎁", label:"Saved",     value:fmt(totalSaved),      sub:"Bonuses" },
        ].map(s=>(
          <div key={s.label} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <p style={{ margin:"0 0 1px", fontWeight:900, color:C.text, fontSize:s.label==="Spent"||s.label==="Saved"?11:18 }}>{s.value}</p>
            <p style={{ margin:0, color:C.sub, fontSize:9, letterSpacing:0.8, textTransform:"uppercase" }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:0, margin:"16px 18px 0", background:C.cream, borderRadius:14, padding:4 }}>
        {[["overview","📈 Overview"],["history","📋 History"],["rewards","🎁 Rewards"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{ flex:1, background:tab===t?C.white:"transparent", border:"none", borderRadius:11, padding:"10px 0", fontSize:11, fontWeight:900, color:tab===t?C.text:C.sub, cursor:"pointer", boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.08)":"none", transition:"all 0.2s" }}>{l}</button>
        ))}
      </div>

      <div style={{ padding:"16px 18px" }}>
        {tab==="overview" && (
          <>
            {/* Spending chart */}
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:15 }}>Spending Breakdown</p>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:14 }}>
              {spendData.map(s=>(
                <div key={s.label} style={{ marginBottom:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{s.label}</span>
                    <span style={{ fontSize:12, fontWeight:900, color:s.color }}>{s.pct}%</span>
                  </div>
                  <div style={{ height:8, background:C.cream, borderRadius:99 }}>
                    <div style={{ height:"100%", width:`${s.pct}%`, background:s.color, borderRadius:99 }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly summary */}
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:15 }}>Monthly Summary</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[
                { label:"This Month",    value:fmt(27300), sub:"Jul 2025",   color:C.accent,  bg:"#0F1A35" },
                { label:"Last Month",    value:fmt(31500), sub:"Jun 2025",   color:C.blue,    bg:"#0A1020" },
                { label:"Avg per Order", value:fmt(6260),  sub:"Last 5 orders", color:C.green,bg:"#0A1F18" },
                { label:"Most Ordered",  value:"Jollof",   sub:"3× this month", color:C.gold, bg:"#1A1000" },
              ].map(s=>(
                <div key={s.label} style={{ background:s.bg, border:`1.5px solid ${s.color}22`, borderRadius:16, padding:14 }}>
                  <p style={{ margin:"0 0 4px", fontSize:10, color:C.sub, fontWeight:700, textTransform:"uppercase", letterSpacing:0.8 }}>{s.label}</p>
                  <p style={{ margin:"0 0 2px", fontWeight:900, color:s.color, fontSize:16 }}>{s.value}</p>
                  <p style={{ margin:0, color:C.sub, fontSize:10 }}>{s.sub}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="history" && (
          <>
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:15 }}>Transaction History</p>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, overflow:"hidden" }}>
              {transactions.map((t,i)=>(
                <div key={t.id}>
                  {i>0&&<HRule/>}
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
                    <div style={{ width:42, height:42, borderRadius:12, background:t.type==="credit"?"#0A1F18":"#0F1A35", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{t.icon}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{t.label}</p>
                      <p style={{ margin:0, color:C.sub, fontSize:10 }}>{t.date}</p>
                    </div>
                    <p style={{ margin:0, fontWeight:900, fontSize:14, color:t.type==="credit"?C.green:C.text }}>
                      {t.type==="credit"?"+":"-"}{fmt(t.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="rewards" && (
          <>
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:15 }}>Redeem Points</p>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              {[{pts:2000,icon:"🍗",label:"Free Starter",claimed:false},{pts:3000,icon:"🍚",label:"Free Main",claimed:false},{pts:5000,icon:"🥂",label:"VIP Table",claimed:false}].map(r=>(
                <div key={r.label} style={{ flex:1, background:C.white, border:`1.5px solid ${r.pts<=points?C.accent:C.border}`, borderRadius:14, padding:"12px 10px", textAlign:"center", opacity:r.pts<=points?1:0.55 }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{r.icon}</div>
                  <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:900, color:C.text }}>{r.label}</p>
                  <p style={{ margin:"0 0 6px", fontSize:10, color:r.pts<=points?C.green:C.sub, fontWeight:700 }}>{r.pts.toLocaleString()} pts</p>
                  {r.pts<=points&&<div style={{ background:C.green, borderRadius:99, padding:"4px 0", color:"#fff", fontSize:9, fontWeight:900, cursor:"pointer" }}>CLAIM</div>}
                </div>
              ))}
            </div>
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:15 }}>Earn More Points</p>
            {[
              { icon:"📸", title:"Share a food photo", pts:"+100 pts", action:"Tag us on Instagram" },
              { icon:"👥", title:"Refer a friend",      pts:"+500 pts", action:"They order, you earn" },
              { icon:"⭐", title:"Rate your order",     pts:"+50 pts",  action:"After delivery" },
              { icon:"📋", title:"Subscribe to Meal Plan", pts:"+1000 pts", action:"Monthly subscription" },
            ].map(e=>(
              <div key={e.title} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontSize:24, width:42, height:42, borderRadius:12, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center" }}>{e.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{e.title}</p>
                  <p style={{ margin:0, color:C.sub, fontSize:11 }}>{e.action}</p>
                </div>
                <Pill bg="#F0FFF0" color={C.green}>{e.pts}</Pill>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopup && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowTopup(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:420, background:"#FAF7F0", borderRadius:"24px 24px 0 0", padding:24, paddingBottom:40 }}>
            <h3 style={{ margin:"0 0 6px", fontWeight:900, color:C.text, fontSize:20 }}>Top Up Wallet</h3>
            <p style={{ margin:"0 0 18px", color:C.sub, fontSize:12 }}>Current balance: {fmt(balance)}</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {TOPUP_AMOUNTS.map(a=>(
                <button key={a} onClick={()=>setTopupAmt(String(a))} style={{ background:topupAmt===String(a)?C.accent:C.cream, border:`1.5px solid ${topupAmt===String(a)?C.accent:C.border}`, borderRadius:12, padding:"12px 0", color:topupAmt===String(a)?"#fff":C.text, fontSize:14, fontWeight:900, cursor:"pointer" }}>{fmt(a)}</button>
              ))}
            </div>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:C.sub, fontSize:14, fontWeight:700 }}>₦</span>
              <input value={topupAmt} onChange={e=>setTopupAmt(e.target.value.replace(/\D/g,""))} placeholder="Or enter custom amount" style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:16, fontWeight:900 }}/>
            </div>
            <div style={{ background:"#F0FFF0", border:"1px solid #0A3D25", borderRadius:12, padding:"10px 14px", marginBottom:16, display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ fontSize:16 }}>🎁</span>
              <p style={{ margin:0, color:C.green, fontSize:12, fontWeight:700 }}>Top up ₦20,000+ and get 200 bonus loyalty points!</p>
            </div>
            <button onClick={doTopup} style={{ width:"100%", background:`linear-gradient(135deg,${C.green},#388E3C)`, color:"#fff", border:"none", borderRadius:14, padding:"16px 0", fontSize:14, fontWeight:900, cursor:"pointer" }}>
              💳 Top Up {topupAmt?fmt(parseInt(topupAmt)||0):""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AI FOOD CHAT ───────────────────────────────────────────────────────── */
function AIChatScreen({ go, setCart }) {
  const { apiKey } = useApiKey();
  const [msgs, setMsgs] = useState([
    { role:"assistant", content:"👨‍🍳 Hey! I'm your Tasty Fingers AI Chef. Ask me anything — from what to order, to nutrition advice, to what's spicy, to pairing drinks with your meal. What are you craving today? 🍽️" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const QUICK = ["What's the healthiest option?","Best meal under ₦4,000?","What's most popular?","Recommend a full combo","I want something spicy 🔥","What pairs well with Egusi?"];

  const SYSTEM_PROMPT = `You are the friendly AI food assistant for Tasty Fingers, a Nigerian restaurant based in Jos and Abuja, Nigeria. You are knowledgeable, warm, and enthusiastic about food. You help customers:
1. Choose what to order based on their preferences, budget, and dietary needs
2. Understand nutritional information
3. Get meal recommendations and combos
4. Learn about Nigerian cuisine and Tasty Fingers specialties

Here is the full menu with prices in Nigerian Naira (₦):

RESTAURANT:
- Ofada Rice & Sauce: ₦4,500 (620 kcal, 28g protein) — Fan Fave, Healthy, Spice level 3/5
- Jollof Rice + Grilled Chicken: ₦5,200 (780 kcal, 42g protein) — Popular, Spice level 2/5
- Coconut Rice: ₦4,000 (540 kcal, 22g protein) — Healthy, Spice level 1/5
- Cassava Leaf & Rice: ₦4,200 (490 kcal, 24g protein) — Healthy, Spice level 2/5
- Egg Fried Rice: ₦3,800 (560 kcal, 20g protein) — Spice level 1/5

GRILL & SHAWARMA:
- Grilled Chicken: ₦4,800 (420 kcal, 52g protein) — Healthy, Spice level 3/5 — Great post-workout meal
- Shawarma: ₦3,500 (510 kcal, 28g protein) — Spice level 2/5
- Suya Chicken: ₦4,200 (380 kcal, 46g protein) — Healthy, Spice level 4/5 — Very spicy!
- Burger: ₦3,800 (650 kcal, 32g protein)

BAKERY:
- Chocolate Bread: ₦2,500 (340 kcal) — Baked fresh daily, loved by all
- Red Velvet Cake (slice): ₦2,800 (420 kcal)
- Meat Pie: ₦800 (280 kcal)

SOUP FACTORY:
- Egusi Soup: ₦3,500 (460 kcal, 34g protein) — Healthy, Popular
- Daily Soup Special: ₦3,200 (380 kcal) — Changes daily

BAR & DRINKS:
- Fresh Fruit Cocktail: ₦2,500 (180 kcal) — Healthy
- Attieke & Fish: ₦4,000 (520 kcal, 38g protein) — West African specialty

Current Flash Deals (limited time): Jollof Rice 20% off, Suya Chicken 15% off, Chocolate Bread 25% off

Loyalty Program: Customers earn points on every order. Silver tier (1000+ pts), Gold tier (3000+ pts).

Be conversational, use emojis sparingly but naturally, and always be helpful. If asked for a recommendation, give specific, confident suggestions with brief reasoning. Keep responses concise (2-4 sentences usually). Don't mention prices unless asked or relevant.`;

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role:"user", content:text };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = newMsgs.map(m => ({ role: m.role, content: m.content }));
      const data = await callAI(apiKey, { system: SYSTEM_PROMPT, messages: apiMessages });
      const reply = data.content?.[0]?.text || "Sorry, I couldn't respond right now. Please try again!";
      setMsgs(m=>[...m, { role:"assistant", content:reply }]);
    } catch(e) {
      setMsgs(m=>[...m, { role:"assistant", content:"Oops, I had a connection issue! Please try again in a moment. 😅" }]);
    }
    setLoading(false);
  };

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs, loading]);

  return (
    <div style={{ height:"100vh", background:"#FAF7F0", display:"flex", flexDirection:"column" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#3D1A00,#8D4E2A)", padding:"20px 18px 18px", flexShrink:0 }}>
        <BackBtn go={go} screen="home"/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:16, background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, position:"relative" }}>
            🤖
            <div style={{ position:"absolute", bottom:1, right:1, width:12, height:12, background:"#66C24A", borderRadius:"50%", border:"2px solid #8D4E2A" }}/>
          </div>
          <div>
            <p style={{ margin:"0 0 2px", fontWeight:900, color:"#fff", fontSize:16 }}>AI Chef Assistant</p>
            <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.7)", fontWeight:600 }}>● AI Chef · Always available</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start", alignItems:"flex-end", gap:8 }}>
            {m.role==="assistant"&&<div style={{ width:28, height:28, borderRadius:10, background:"linear-gradient(135deg,#3D1A00,#8D4E2A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>🤖</div>}
            <div style={{ maxWidth:"78%", background:m.role==="user"?`linear-gradient(135deg,#C0290A,#E63939)`:C.white, border:m.role==="user"?"none":`1.5px solid ${C.border}`, borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"12px 14px", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <p style={{ margin:0, fontSize:13, color:m.role==="user"?"#fff":C.text, lineHeight:1.6 }}>{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", alignItems:"flex-end", gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:10, background:"linear-gradient(135deg,#3D1A00,#8D4E2A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>🤖</div>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:"18px 18px 18px 4px", padding:"14px 18px", display:"flex", gap:5, alignItems:"center" }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:7, height:7, borderRadius:"50%", background:C.purple, opacity:0.6, animation:`bounce${i} 1.2s ease-in-out ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick replies */}
      <div style={{ background:C.white, padding:"8px 18px 6px", borderTop:`1px solid ${C.border}`, display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
        {QUICK.map(q=>(
          <button key={q} onClick={()=>send(q)} style={{ background:C.cream, border:`1px solid ${C.border}`, borderRadius:99, padding:"6px 12px", whiteSpace:"nowrap", fontSize:10, fontWeight:700, color:C.sub, cursor:"pointer", flexShrink:0 }}>{q}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background:C.white, padding:"10px 18px 16px", borderTop:`1px solid ${C.border}`, display:"flex", gap:10, flexShrink:0 }}>
        <div style={{ flex:1, background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, display:"flex", alignItems:"center", padding:"0 14px", gap:8 }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)} placeholder="Ask me anything about food..." style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:13, padding:"12px 0" }}/>
        </div>
        <button onClick={()=>send(input)} disabled={loading||!input.trim()} style={{ background:loading?C.border:`linear-gradient(135deg,#8D4E2A,#3D1A00)`, border:"none", borderRadius:14, width:46, height:46, cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>➤</button>
      </div>
      <style>{`
        @keyframes bounce0 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes bounce1 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
        @keyframes bounce2 { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }
      `}</style>
    </div>
  );
}

/* ─── ORDER TRACKING ────────────────────────────────────────────────────── */
function OrdersScreen({ go }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeOrder] = useState({
    id:"TF-2024-082",
    status:2,
    items:["Jollof Rice + Grilled Chicken","Fresh Fruit Cocktail"],
    total:7700,
    placed:"12:14 PM",
    eta:"12:50 PM",
    rider:"Emeka O.",
    phone:"+234 803 100 0001",
  });

  const STATUSES = [
    { icon:"✅", label:"Order Placed",       done:true  },
    { icon:"👨‍🍳", label:"Preparing",       done:true  },
    { icon:"🛵", label:"On the way",         done:false },
    { icon:"🏠", label:"Delivered",          done:false },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:C.white, padding:"20px 18px 18px", borderBottom:`1px solid ${C.border}` }}>
        <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.text }}>📦 My Orders</h2>
        <p style={{ margin:0, color:C.sub, fontSize:12 }}>Track your current and past orders</p>
      </div>

      {/* Active order */}
      <div style={{ margin:"16px 18px 0", background:"linear-gradient(135deg,#FFF8F0,#FFF3EC)", border:`2px solid ${C.accent}33`, borderRadius:20, overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.8)", fontSize:10, fontWeight:700, letterSpacing:1 }}>LIVE ORDER</p>
            <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:15 }}>{activeOrder.id}</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.7)", fontSize:10 }}>Est. Arrival</p>
            <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:16 }}>{activeOrder.eta}</p>
          </div>
        </div>
        <div style={{ padding:"16px 18px" }}>
          {/* Progress */}
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:18, position:"relative" }}>
            <div style={{ position:"absolute", top:18, left:"12.5%", right:"12.5%", height:3, background:C.border, zIndex:0 }}>
              <div style={{ height:"100%", width:`${(activeOrder.status/3)*100}%`, background:C.accent, borderRadius:99 }}/>
            </div>
            {STATUSES.map((s,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, zIndex:1, flex:1 }}>
                <div style={{ width:36, height:36, borderRadius:99, background:i<=activeOrder.status?C.accent:C.cream, border:`2px solid ${i<=activeOrder.status?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>{s.icon}</div>
                <span style={{ fontSize:9, fontWeight:800, color:i<=activeOrder.status?C.accent:C.sub, textAlign:"center", lineHeight:1.3 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Rider */}
          <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,#C0290A,#E63939)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🛵</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:14 }}>{activeOrder.rider}</p>
              <p style={{ margin:0, color:C.sub, fontSize:11 }}>Your delivery rider · On the way</p>
            </div>
            <a href={`tel:${activeOrder.phone}`} style={{ background:`linear-gradient(135deg,${C.green},#388E3C)`, border:"none", borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer", textDecoration:"none" }}>📞 Call</a>
          </div>
        </div>
      </div>

      {/* Past orders */}
      <div style={{ padding:"20px 18px 0" }}>
        <p style={{ margin:"0 0 12px", fontSize:10, color:C.sub, letterSpacing:2, textTransform:"uppercase", fontWeight:800 }}>Order History</p>
        {ORDER_HISTORY.map(order=>(
          <div key={order.id} onClick={()=>setSelectedOrder(order)} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:12, cursor:"pointer" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{order.id}</p>
                <p style={{ margin:0, color:C.sub, fontSize:11 }}>{new Date(order.date).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})}</p>
              </div>
              <Pill bg="#F0FFF0" color={C.green}>✓ {order.status}</Pill>
            </div>
            <p style={{ margin:"0 0 10px", color:C.text, fontSize:12, lineHeight:1.5 }}>{order.items.join(", ")}</p>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:900, color:C.accent, fontSize:15 }}>{fmt(order.total)}</span>
              <div style={{ display:"flex", gap:2 }}>
                {[1,2,3,4,5].map(s=>(
                  <span key={s} style={{ fontSize:12, color:s<=order.rating?"#FFC107":"#DDD" }}>★</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setSelectedOrder(null)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:420, background:"#FAF7F0", borderRadius:"24px 24px 0 0", padding:24, paddingBottom:40 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <h3 style={{ margin:0, fontWeight:900, color:C.text }}>{selectedOrder.id}</h3>
              <Pill bg="#F0FFF0" color={C.green}>✓ Delivered</Pill>
            </div>
            {selectedOrder.items.map((item,i)=>(
              <div key={i} style={{ background:C.cream, borderRadius:12, padding:"12px 14px", marginBottom:8, display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:22 }}>{MENU.find(m=>m.name===item)?.emoji||"🍽"}</span>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{item}</span>
              </div>
            ))}
            <div style={{ display:"flex", justifyContent:"space-between", margin:"14px 0" }}>
              <span style={{ color:C.sub, fontSize:13 }}>Total Paid</span>
              <span style={{ fontWeight:900, color:C.text, fontSize:16 }}>{fmt(selectedOrder.total)}</span>
            </div>
            <button style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900, cursor:"pointer" }}>
              🔄 Reorder This
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── RESERVATION ───────────────────────────────────────────────────────── */
function ReserveScreen() {
  const [step, setStep] = useState(1);
  const [loc, setLoc] = useState("abuja");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [occasion, setOccasion] = useState("");
  const [done, setDone] = useState(false);

  const TIMES = ["12:00 PM","12:30 PM","1:00 PM","1:30 PM","6:00 PM","6:30 PM","7:00 PM","7:30 PM","8:00 PM"];
  const OCCASIONS = [
    { id:"",          icon:"🍽", label:"Regular Dining" },
    { id:"birthday",  icon:"🎂", label:"Birthday" },
    { id:"date",      icon:"💑", label:"Date Night" },
    { id:"business",  icon:"💼", label:"Business Meal" },
    { id:"anniversary",icon:"💍",label:"Anniversary" },
  ];

  if(done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", padding:24, paddingBottom:90 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🎉</div>
        <h2 style={{ margin:"0 0 8px", fontSize:26, fontWeight:900, color:C.text }}>Table Booked!</h2>
        <p style={{ margin:"0 0 20px", color:C.sub, fontSize:14, lineHeight:1.6 }}>We've reserved a table for <strong>{guests}</strong> at <strong>{LOCATIONS.find(l=>l.id===loc)?.name}</strong> on <strong>{date}</strong> at <strong>{time}</strong>.</p>
        <p style={{ margin:"0 0 24px", color:C.sub, fontSize:12 }}>A confirmation will be sent to {phone}.</p>
        <button onClick={()=>{setDone(false);setStep(1);}} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 32px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>
          Book Another Table
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"24px 18px 28px" }}>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>📅 Reserve a Table</h2>
        <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.75)", fontSize:12 }}>Book your spot at Tasty Fingers</p>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3].map(s=>(
            <div key={s} style={{ flex:1, height:4, borderRadius:99, background:s<=step?"#fff":"rgba(255,255,255,0.3)" }}/>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 18px" }}>
        {step===1&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Pick Location & Date</p>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              {LOCATIONS.map(l=>(
                <button key={l.id} onClick={()=>setLoc(l.id)} style={{ flex:1, background:loc===l.id?C.cream:C.white, border:`2px solid ${loc===l.id?C.accent:C.border}`, borderRadius:16, padding:"14px 10px", cursor:"pointer" }}>
                  <p style={{ margin:"0 0 2px", fontWeight:900, color:loc===l.id?C.accent:C.text, fontSize:13 }}>{l.name}</p>
                  <p style={{ margin:"0 0 4px", color:C.sub, fontSize:10, lineHeight:1.4 }}>{l.address}</p>
                  <Tag text={l.hours} color={C.green} bg="#F0FFF0"/>
                </button>
              ))}
            </div>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
              <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Date</p>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700, width:"100%", colorScheme:"light" }}/>
            </div>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:16 }}>
              <p style={{ margin:"0 0 10px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Time</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {TIMES.map(t=>(
                  <button key={t} onClick={()=>setTime(t)} style={{ background:time===t?C.accent:C.cream, border:`1.5px solid ${time===t?C.accent:C.border}`, borderRadius:10, padding:"8px 12px", color:time===t?"#fff":C.sub, fontSize:11, fontWeight:800, cursor:"pointer" }}>{t}</button>
                ))}
              </div>
            </div>
          </>
        )}

        {step===2&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Party Size & Occasion</p>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <p style={{ margin:0, fontWeight:900, color:C.text, fontSize:14 }}>👥 Number of Guests</p>
                <span style={{ fontWeight:900, color:C.accent, fontSize:20 }}>{guests}</span>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:20, justifyContent:"center" }}>
                <button onClick={()=>setGuests(g=>Math.max(1,g-1))} style={{ width:44, height:44, borderRadius:99, background:C.cream, border:`2px solid ${C.border}`, fontSize:22, cursor:"pointer" }}>−</button>
                <div style={{ display:"flex", gap:4 }}>
                  {Array.from({length:Math.min(guests,8)}).map((_,i)=>(
                    <div key={i} style={{ width:28, height:28, borderRadius:99, background:`linear-gradient(135deg,#C0290A,#E63939)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>👤</div>
                  ))}
                  {guests>8&&<div style={{ width:28, height:28, borderRadius:99, background:C.cream, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:C.sub }}>+{guests-8}</div>}
                </div>
                <button onClick={()=>setGuests(g=>Math.min(20,g+1))} style={{ width:44, height:44, borderRadius:99, background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", fontSize:22, cursor:"pointer", color:"#fff", fontWeight:900 }}>+</button>
              </div>
            </div>
            <p style={{ margin:"0 0 10px", fontWeight:700, color:C.sub, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" }}>Occasion (optional)</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
              {OCCASIONS.map(o=>(
                <button key={o.id} onClick={()=>setOccasion(o.id)} style={{ background:occasion===o.id?C.cream:C.white, border:`2px solid ${occasion===o.id?C.accent:C.border}`, borderRadius:14, padding:"12px 10px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{o.icon}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:occasion===o.id?C.accent:C.text }}>{o.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step===3&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Your Contact Details</p>
            {[
              { label:"Full Name",       val:name,  set:setName,  placeholder:"e.g. Chioma Eze" },
              { label:"Phone Number", val:phone, set:setPhone, placeholder:"+234 800 000 0000" },
            ].map(f=>(
              <div key={f.label} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
                <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>{f.label}</p>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700, width:"100%" }}/>
              </div>
            ))}
            {/* Summary */}
            <div style={{ background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:14 }}>
              <p style={{ margin:"0 0 10px", fontWeight:800, color:C.sub, fontSize:10, letterSpacing:1.5, textTransform:"uppercase" }}>Booking Summary</p>
              {[
                ["📍 Location", LOCATIONS.find(l=>l.id===loc)?.name],
                ["📅 Date & Time", `${date} · ${time}`],
                ["👥 Guests", `${guests} people`],
                ["🎉 Occasion", OCCASIONS.find(o=>o.id===occasion)?.label||"Regular Dining"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                  <span style={{ color:C.sub, fontSize:12 }}>{k}</span>
                  <span style={{ fontWeight:800, color:C.text, fontSize:12 }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:12, marginTop:8 }}>
          {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"15px 0", color:C.text, fontSize:13, fontWeight:800, cursor:"pointer" }}>← Back</button>}
          <button onClick={()=>{if(step<3)setStep(s=>s+1);else setDone(true);}} disabled={step===1&&(!date||!time)} style={{ flex:2, background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900, cursor:"pointer", opacity:step===1&&(!date||!time)?0.6:1 }}>
            {step<3?"Continue →":"Confirm Booking ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE SCREEN ────────────────────────────────────────────────────── */
function ProfileScreen({ go }) {
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const points = 1840, nextTier = 3000;

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"28px 18px 36px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
        <div style={{ width:76, height:76, borderRadius:22, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:40, margin:"0 auto 12px" }}>👤</div>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:22, fontWeight:900 }}>Adaeze Okonkwo</h2>
        <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.75)", fontSize:12 }}>Member since Jan 2024 · Abuja 📍</p>
        <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:16, padding:"12px 16px", display:"inline-flex", gap:16, alignItems:"center" }}>
          <div style={{ textAlign:"center" }}>
            <p style={{ margin:"0 0 1px", color:"#fff", fontWeight:900, fontSize:18 }}>{points.toLocaleString()}</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:9, textTransform:"uppercase", letterSpacing:0.8 }}>Points</p>
          </div>
          <div style={{ width:1, height:30, background:"rgba(255,255,255,0.3)" }}/>
          <div style={{ textAlign:"center" }}>
            <p style={{ margin:"0 0 1px", color:"#fff", fontWeight:900, fontSize:18 }}>🏅</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:9, textTransform:"uppercase", letterSpacing:0.8 }}>Silver</p>
          </div>
          <div style={{ width:1, height:30, background:"rgba(255,255,255,0.3)" }}/>
          <div style={{ textAlign:"center" }}>
            <p style={{ margin:"0 0 1px", color:"#fff", fontWeight:900, fontSize:18 }}>{ORDER_HISTORY.length}</p>
            <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:9, textTransform:"uppercase", letterSpacing:0.8 }}>Orders</p>
          </div>
        </div>
        {/* Points progress */}
        <div style={{ marginTop:16, background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"10px 14px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
            <span style={{ color:"rgba(255,255,255,0.75)", fontSize:10 }}>Progress to Gold</span>
            <span style={{ color:"#fff", fontSize:10, fontWeight:900 }}>{Math.round((points/nextTier)*100)}%</span>
          </div>
          <div style={{ height:6, background:"rgba(255,255,255,0.2)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${(points/nextTier)*100}%`, background:"#fff", borderRadius:99 }}/>
          </div>
          <p style={{ margin:"6px 0 0", color:"rgba(255,255,255,0.75)", fontSize:10 }}>{(nextTier-points).toLocaleString()} pts to Gold → Free Meal!</p>
        </div>
      </div>

      <div style={{ padding:"16px 18px" }}>
        <p style={{ fontSize:10, color:C.sub, letterSpacing:2, textTransform:"uppercase", margin:"0 0 12px", fontWeight:800 }}>Rewards</p>
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {[{pts:2000,icon:"🍗",label:"Free Starter"},{pts:3000,icon:"🍚",label:"Free Main"},{pts:5000,icon:"🥂",label:"VIP Table"}].map(r=>(
            <div key={r.label} style={{ flex:1, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"12px 10px", textAlign:"center", opacity:r.pts<=points?1:0.55 }}>
              <div style={{ fontSize:26, marginBottom:6 }}>{r.icon}</div>
              <p style={{ margin:"0 0 4px", fontSize:10, fontWeight:900, color:C.text }}>{r.label}</p>
              <p style={{ margin:0, fontSize:10, color:r.pts<=points?C.green:C.sub, fontWeight:700 }}>{r.pts.toLocaleString()} pts</p>
              {r.pts<=points&&<div style={{ marginTop:6, background:C.green, borderRadius:99, padding:"3px 0", color:"#fff", fontSize:9, fontWeight:900, cursor:"pointer" }}>CLAIM</div>}
            </div>
          ))}
        </div>

        {[
          {section:"Quick Links",items:[
            {icon:"🎂",label:"Celebrations & Birthdays",action:()=>go("birthday")},
            {icon:"📋",label:"My Meal Subscription",action:()=>go("mealplan")},
            {icon:"🧮",label:"Split Bill Calculator",action:()=>go("split")},
            {icon:"🤖",label:"AI Chef Assistant",action:()=>go("aichat")},
            {icon:"💳",label:"My Wallet & Points",action:()=>go("dashboard")},
            {icon:"🔥",label:"My Streak",action:()=>go("streak")},
            {icon:"📱",label:"Dine-In (Table Order)",action:()=>go("dinein")},
          ]},
          {section:"Account",items:[
            {icon:"✏️",label:"Edit Profile"},{icon:"📍",label:"My Addresses"},{icon:"❤️",label:"Saved Orders"},
          ]},
          {section:"Notifications",items:[
            {icon:"🔔",label:"Push Notifications",toggle:true,val:notifications,set:setNotifications},
            {icon:"💬",label:"SMS Order Alerts",toggle:true,val:smsAlerts,set:setSmsAlerts},
          ]},
          {section:"Contact",items:[
            {icon:"📞",label:"Call: +234 803 722 9711"},
            {icon:"💬",label:"Live Chat Support"},
            {icon:"📸",label:"Instagram @tasty.fingers"},
          ]},
          {section:"Legal",items:[
            {icon:"📄",label:"Terms & Conditions"},{icon:"🔒",label:"Privacy Policy"},
          ]},
        ].map(group=>(
          <div key={group.section} style={{ marginBottom:20 }}>
            <p style={{ fontSize:10, fontWeight:800, color:C.sub, letterSpacing:2, textTransform:"uppercase", margin:"0 0 10px" }}>{group.section}</p>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, overflow:"hidden" }}>
              {group.items.map((item,i)=>(
                <div key={item.label}>
                  {i>0&&<HRule/>}
                  <div onClick={item.action} style={{ display:"flex", alignItems:"center", padding:"14px 16px", gap:12, cursor:item.action?"pointer":"default" }}>
                    <span style={{ fontSize:18 }}>{item.icon}</span>
                    <span style={{ flex:1, fontSize:13, fontWeight:700, color:C.text }}>{item.label}</span>
                    {item.toggle?(
                      <div onClick={()=>item.set(v=>!v)} style={{ width:46, height:26, borderRadius:99, background:item.val?C.accent:C.border, cursor:"pointer", position:"relative", transition:"all 0.2s" }}>
                        <div style={{ position:"absolute", top:3, left:item.val?23:3, width:20, height:20, borderRadius:99, background:"#fff", transition:"all 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
                      </div>
                    ):<span style={{ color:C.border, fontSize:18 }}>›</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button style={{ width:"100%", background:"#FFF0F0", border:"1.5px solid #3A0A0A", borderRadius:14, padding:"15px 0", color:"#F87171", fontSize:13, fontWeight:900, cursor:"pointer" }}>Log Out</button>
        <p style={{ textAlign:"center", color:C.sub, fontSize:10, marginTop:16, lineHeight:1.7 }}>
          Tasty Fingers Enterprises · Jos & Abuja, Nigeria<br/>Founded by Tina Akintola · Tastifingers2007@gmail.com
        </p>
      </div>
    </div>
  );
}

/* ─── FLASH SCREEN ──────────────────────────────────────────────────────── */
function FlashScreen({ cart, setCart, go }) {
  const [secs, setSecs] = useState(3600-(new Date().getMinutes()*60+new Date().getSeconds()));
  useEffect(()=>{ const t=setInterval(()=>setSecs(s=>s<=1?3599:s-1),1000); return()=>clearInterval(t); },[]);
  const h=String(Math.floor(secs/3600)).padStart(2,"0"), m=String(Math.floor((secs%3600)/60)).padStart(2,"0"), s=String(secs%60).padStart(2,"0");
  const addToCart=(item,pct)=>{
    const dp=Math.round(item.price*(1-pct/100));
    setCart(c=>{const ex=c.find(x=>x.id===item.id);return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,price:dp,qty:1,flashDeal:true}]});
  };
  return (
    <div style={{ minHeight:"100vh", background:"#0D0603", paddingBottom:90 }}>
      <div style={{ background:"#0D0603", padding:"20px 18px 20px", borderBottom:"1px solid #2A1A10" }}>
        <button onClick={()=>go("home")} style={{ background:"#FFF4EC", border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", color:"#fff", fontSize:18, marginBottom:14 }}>←</button>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>⚡ Flash Deals</h2>
        <p style={{ margin:"0 0 14px", color:"rgba(255,255,255,0.5)", fontSize:12 }}>Limited-time prices. Order fast.</p>
        <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
          {[["HRS",h],["MIN",m],["SEC",s]].map(([l,v])=>(
            <div key={l} style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", textAlign:"center", minWidth:70 }}>
              <div style={{ color:C.accent2, fontSize:28, fontWeight:900, lineHeight:1 }}>{v}</div>
              <div style={{ color:"rgba(255,255,255,0.4)", fontSize:10, marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"16px 18px" }}>
        {FLASH_DEALS.map(deal=>{
          const item=MENU.find(x=>x.id===deal.id);
          const np=Math.round(item.price*(1-deal.discount/100));
          return (
            <div key={deal.id} style={{ background:"#FFF4EC", border:"1px solid #E6393944", borderRadius:20, padding:18, marginBottom:14, display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:66, height:66, borderRadius:16, background:"#2A1005", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <Pill bg={C.accent} color="#fff">{deal.discount}% OFF · {deal.label}</Pill>
                <p style={{ margin:"6px 0 2px", color:"#fff", fontWeight:900, fontSize:15 }}>{item.name}</p>
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <span style={{ color:C.accent2, fontWeight:900, fontSize:16 }}>{fmt(np)}</span>
                  <span style={{ color:"rgba(255,255,255,0.3)", fontSize:12, textDecoration:"line-through" }}>{fmt(item.price)}</span>
                </div>
              </div>
              <button onClick={()=>addToCart(item,deal.discount)} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:12, padding:"10px 14px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer" }}>Add</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MENU SCREEN ───────────────────────────────────────────────────────── */
function MenuScreen({ cart, setCart }) {
  const [activeSection,setActiveSection]=useState("All");
  const [search,setSearch]=useState("");
  const [healthyOnly,setHealthyOnly]=useState(false);
  const [showNutrition,setShowNutrition]=useState(null);
  const addToCart=(item)=>setCart(c=>{const ex=c.find(x=>x.id===item.id);return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}]});
  const removeFromCart=(item)=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty-1}:x).filter(x=>x.qty>0));
  const filtered=MENU.filter(m=>(activeSection==="All"||m.section===activeSection)&&m.name.toLowerCase().includes(search.toLowerCase())&&(!healthyOnly||m.healthy));

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:110 }}>
      {showNutrition && (
        <div onClick={()=>setShowNutrition(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:420, background:"#FAF7F0", borderRadius:"24px 24px 0 0", padding:24, paddingBottom:40 }}>
            <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:18 }}>
              <div style={{ width:60, height:60, borderRadius:14, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32 }}>{showNutrition.emoji}</div>
              <div>
                <h3 style={{ margin:"0 0 2px", fontWeight:900, color:C.text }}>{showNutrition.name}</h3>
                <p style={{ margin:0, color:C.sub, fontSize:12 }}>Nutrition Info · {fmt(showNutrition.price)}</p>
              </div>
            </div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <NutritionRing cal={showNutrition.cal} protein={showNutrition.protein} carbs={showNutrition.carbs} fat={showNutrition.fat} size={100}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
              {[["🔥 Calories",`${showNutrition.cal} kcal`,"#0F1A35",C.accent],["💪 Protein",`${showNutrition.protein}g`,"#0A1F18",C.green],["🍞 Carbs",`${showNutrition.carbs}g`,"#0A1020","#FF5722"],["💧 Fat",`${showNutrition.fat}g`,"#1A0A0A","#F87171"]].map(([l,v,bg,c])=>(
                <div key={l} style={{ background:bg, borderRadius:14, padding:14, textAlign:"center" }}>
                  <p style={{ margin:"0 0 4px", fontSize:10, color:C.sub, fontWeight:700 }}>{l}</p>
                  <p style={{ margin:0, fontWeight:900, color:c, fontSize:18 }}>{v}</p>
                </div>
              ))}
            </div>
            <p style={{ margin:"0 0 8px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Ingredients</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
              {showNutrition.ingredients.map(ing=>(
                <Tag key={ing} text={ing} color={C.sub} bg={C.cream}/>
              ))}
            </div>
          </div>
        </div>
      )}

      <div style={{ background:C.white, padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:12 }}>
          <div style={{ flex:1, background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, display:"flex", alignItems:"center", padding:"0 14px", gap:8 }}>
            <span style={{ color:C.sub }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu..." style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:13, padding:"11px 0" }}/>
          </div>
          <button onClick={()=>setHealthyOnly(h=>!h)} style={{ background:healthyOnly?C.green:C.cream, border:`1.5px solid ${healthyOnly?C.green:C.border}`, borderRadius:14, padding:"11px 14px", color:healthyOnly?"#fff":C.sub, fontSize:11, fontWeight:800, cursor:"pointer", whiteSpace:"nowrap" }}>🌿 Healthy</button>
        </div>
        <div style={{ display:"flex", gap:8, overflowX:"auto", scrollbarWidth:"none" }}>
          {SECTIONS.map(s=>(
            <button key={s} onClick={()=>setActiveSection(s)} style={{ background:activeSection===s?C.accent:C.cream, border:activeSection===s?"none":`1.5px solid ${C.border}`, borderRadius:99, padding:"7px 14px", color:activeSection===s?"#fff":C.sub, fontSize:11, fontWeight:800, cursor:"pointer", flexShrink:0 }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px 18px" }}>
        {filtered.length===0&&(
          <div style={{ textAlign:"center", padding:"40px 0", color:C.sub }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <p style={{ fontSize:15, fontWeight:700 }}>No results found</p>
          </div>
        )}
        {filtered.map(item=>{
          const inCart=cart.find(x=>x.id===item.id);
          return (
            <div key={item.id} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:12, display:"flex", gap:14 }}>
              <div onClick={()=>setShowNutrition(item)} style={{ width:70, height:70, borderRadius:16, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0, cursor:"pointer", position:"relative" }}>
                {item.emoji}
                {item.healthy&&<div style={{ position:"absolute", bottom:-4, right:-4, background:C.green, borderRadius:99, width:16, height:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:8 }}>🌿</div>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", gap:4, flexWrap:"wrap", marginBottom:4 }}>
                  {item.tag&&<Pill bg="#FFF4EC" color={C.accent}>{item.tag}</Pill>}
                  {item.spice>=4&&<Pill bg="#FFF0F0" color="#CC2222">🔥 Very Spicy</Pill>}
                </div>
                <p style={{ margin:"4px 0 2px", fontWeight:900, color:C.text, fontSize:14 }}>{item.name}</p>
                <p style={{ margin:"0 0 8px", color:C.sub, fontSize:11, lineHeight:1.5 }}>{item.desc}</p>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:900, color:C.accent, fontSize:16 }}>{fmt(item.price)}</span>
                  <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                    <button onClick={()=>setShowNutrition(item)} style={{ background:C.cream, border:`1px solid ${C.border}`, borderRadius:8, padding:"5px 8px", fontSize:10, fontWeight:700, cursor:"pointer", color:C.sub }}>ℹ️ Info</button>
                    {inCart?(
                      <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                        <button onClick={()=>removeFromCart(item)} style={{ width:30, height:30, borderRadius:99, background:C.cream, border:`1.5px solid ${C.border}`, fontSize:18, cursor:"pointer", color:C.text, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                        <span style={{ fontWeight:900, color:C.accent, fontSize:14, minWidth:16, textAlign:"center" }}>{inCart.qty}</span>
                        <button onClick={()=>addToCart(item)} style={{ width:30, height:30, borderRadius:99, background:C.accent, border:"none", fontSize:18, cursor:"pointer", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900 }}>+</button>
                      </div>
                    ):(
                      <button onClick={()=>addToCart(item)} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:10, padding:"7px 14px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer" }}>+ Add</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── CART SCREEN ───────────────────────────────────────────────────────── */
function CartScreen({ cart, setCart, go }) {
  const [tip, setTip] = useState(0);
  const [payMethod, setPayMethod] = useState("wallet");
  const [ordered, setOrdered] = useState(false);
  const subtotal = cart.reduce((a,i)=>a+i.price*i.qty,0);
  const delivery = 1000;
  const tipAmt = Math.round(subtotal*(tip/100));
  const total = subtotal + delivery + tipAmt;

  if(ordered) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:80, marginBottom:16 }}>🎉</div>
        <h2 style={{ margin:"0 0 8px", fontSize:26, fontWeight:900, color:C.text }}>Order Placed!</h2>
        <p style={{ margin:"0 0 6px", color:C.sub, fontSize:14 }}>Your order has been received.</p>
        <p style={{ margin:"0 0 6px", color:C.sub, fontSize:13 }}>Order ID: <strong>TF-2024-083</strong></p>
        <p style={{ margin:"0 0 24px", color:C.sub, fontSize:13 }}>Est. delivery: <strong>35–50 min</strong></p>
        <div style={{ display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
          <button onClick={()=>go("tracker")} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 32px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", width:"100%", maxWidth:280 }}>🛵 Track My Order Live</button>
          <button onClick={()=>{setOrdered(false);setCart([]);go("home");}} style={{ background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"14px 32px", color:C.text, fontSize:13, fontWeight:800, cursor:"pointer", width:"100%", maxWidth:280 }}>Back Home</button>
        </div>
      </div>
    </div>
  );

  if(cart.length===0) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:24 }}>
      <div style={{ fontSize:60 }}>🛒</div>
      <h3 style={{ margin:0, color:C.text, fontWeight:900, fontSize:20 }}>Your cart is empty</h3>
      <p style={{ margin:0, color:C.sub, fontSize:13 }}>Add some delicious items!</p>
      <button onClick={()=>go("menu")} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:8 }}>Browse Menu</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:110 }}>
      <div style={{ background:C.white, padding:"20px 18px 18px", borderBottom:`1px solid ${C.border}` }}>
        <button onClick={()=>go("menu")} style={{ background:C.cream, border:"none", borderRadius:10, width:36, height:36, cursor:"pointer", color:C.text, fontSize:18, marginBottom:12 }}>←</button>
        <h2 style={{ margin:"0 0 2px", fontSize:22, fontWeight:900, color:C.text }}>🛒 Your Cart</h2>
        <p style={{ margin:0, color:C.sub, fontSize:12 }}>{cart.reduce((a,i)=>a+i.qty,0)} items</p>
      </div>

      <div style={{ padding:"16px 18px" }}>
        {cart.map(item=>(
          <div key={item.id} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:14, marginBottom:10, display:"flex", gap:12, alignItems:"center" }}>
            <div style={{ width:54, height:54, borderRadius:12, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{item.emoji}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{item.name}</p>
              <p style={{ margin:0, color:C.accent, fontWeight:900, fontSize:14 }}>{fmt(item.price)}</p>
              {item.flashDeal&&<Pill bg="#FFF4EC" color={C.accent}>⚡ Flash Deal</Pill>}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty-1}:x).filter(x=>x.qty>0))} style={{ width:30, height:30, borderRadius:99, background:C.cream, border:`1.5px solid ${C.border}`, fontSize:18, cursor:"pointer" }}>−</button>
              <span style={{ fontWeight:900, color:C.text, fontSize:15, minWidth:20, textAlign:"center" }}>{item.qty}</span>
              <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x))} style={{ width:30, height:30, borderRadius:99, background:C.accent, border:"none", fontSize:18, cursor:"pointer", color:"#fff", fontWeight:900 }}>+</button>
            </div>
          </div>
        ))}

        {/* Tip */}
        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:12 }}>
          <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:14 }}>✨ Add a Tip?</p>
          <div style={{ display:"flex", gap:8 }}>
            {[0,5,10,15].map(pct=>(
              <button key={pct} onClick={()=>setTip(pct)} style={{ flex:1, background:tip===pct?C.accent:C.cream, border:`1.5px solid ${tip===pct?C.accent:C.border}`, borderRadius:10, padding:"9px 0", color:tip===pct?"#fff":C.sub, fontSize:11, fontWeight:900, cursor:"pointer" }}>{pct===0?"None":`${pct}%`}</button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:12 }}>
          <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:14 }}>💳 Payment Method</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {[
              { id:"wallet", icon:"💳", label:"Tasty Wallet", sub:"Balance: ₦25,000" },
              { id:"card",   icon:"🏦", label:"Debit Card",   sub:"Visa ···· 4582" },
              { id:"cash",   icon:"💵", label:"Pay on Delivery", sub:"Cash only" },
            ].map(m=>(
              <button key={m.id} onClick={()=>setPayMethod(m.id)} style={{ display:"flex", alignItems:"center", gap:12, background:payMethod===m.id?C.cream:C.white, border:`2px solid ${payMethod===m.id?C.accent:C.border}`, borderRadius:12, padding:"12px 14px", cursor:"pointer", textAlign:"left" }}>
                <span style={{ fontSize:22 }}>{m.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:900, color:payMethod===m.id?C.accent:C.text, fontSize:13 }}>{m.label}</p>
                  <p style={{ margin:0, color:C.sub, fontSize:11 }}>{m.sub}</p>
                </div>
                <div style={{ width:18, height:18, borderRadius:99, border:`2px solid ${payMethod===m.id?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {payMethod===m.id&&<div style={{ width:10, height:10, borderRadius:99, background:C.accent }}/>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{ background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
          {[["Subtotal",subtotal],["Delivery",delivery],["Tip",tipAmt]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
              <span style={{ color:C.sub, fontSize:13 }}>{l}</span>
              <span style={{ fontWeight:700, color:C.text, fontSize:13 }}>{fmt(v)}</span>
            </div>
          ))}
          <HRule/>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontWeight:900, color:C.text, fontSize:15 }}>Total</span>
            <span style={{ fontWeight:900, color:C.accent, fontSize:18 }}>{fmt(total)}</span>
          </div>
        </div>

        <button onClick={()=>setOrdered(true)} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:16, padding:"18px 0", fontSize:15, fontWeight:900, cursor:"pointer", boxShadow:"0 8px 28px #E6393944", marginBottom:10 }}>
          Place Order Now · {fmt(total)}
        </button>
        <button onClick={()=>go("schedule")} style={{ width:"100%", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:"14px 0", fontSize:13, fontWeight:800, color:C.text, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          ⏰ Schedule for Later
        </button>
      </div>
    </div>
  );
}

/* ─── GROUP ORDER ───────────────────────────────────────────────────────── */
function GroupOrderScreen({ go }) {
  const [link] = useState("tastyfingers.app/group/TF-GRP-" + Math.random().toString(36).substring(2,8).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [members] = useState([
    { name:"You (Host)", items:["Jollof Rice","Fruit Cocktail"], total:7700, avatar:"👑" },
    { name:"Tunde",      items:["Ofada Rice","Grilled Chicken"], total:9300, avatar:"👤" },
    { name:"Amaka",      items:["Egusi Soup"],                   total:3500, avatar:"👤" },
  ]);
  const grandTotal = members.reduce((a,m)=>a+m.total,0);

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#8B1A0A,#C0290A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>👥 Group Order</h2>
        <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.7)", fontSize:12 }}>Invite friends to add their orders — pay together or split</p>
        <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:14, padding:"12px 14px", display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ color:"rgba(255,255,255,0.6)", fontSize:11, flex:1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{link}</span>
          <button onClick={()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000); }} style={{ background:copied?C.green:C.accent, border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:11, fontWeight:900, cursor:"pointer", flexShrink:0, transition:"all 0.2s" }}>{copied?"✓ Copied":"Copy Link"}</button>
        </div>
      </div>

      <div style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ margin:0, fontWeight:900, color:C.text, fontSize:16 }}>Order Members</p>
          <Pill bg="#F0FFF0" color={C.green}>{members.length} joined</Pill>
        </div>

        {members.map((m,i)=>(
          <div key={i} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:14, marginBottom:10 }}>
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
              <div style={{ width:36, height:36, borderRadius:99, background:i===0?`linear-gradient(135deg,#C0290A,#E63939)`:C.cream, border:`1.5px solid ${i===0?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{m.avatar}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 1px", fontWeight:900, color:C.text, fontSize:14 }}>{m.name}</p>
                <p style={{ margin:0, color:C.sub, fontSize:11 }}>{m.items.length} item{m.items.length!==1?"s":""}</p>
              </div>
              <span style={{ fontWeight:900, color:C.accent, fontSize:15 }}>{fmt(m.total)}</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {m.items.map(item=>(
                <Tag key={item} text={item} color={C.sub} bg={C.cream}/>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontWeight:900, color:C.text, fontSize:15 }}>Grand Total</span>
            <span style={{ fontWeight:900, color:C.accent, fontSize:18 }}>{fmt(grandTotal)}</span>
          </div>
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button style={{ flex:1, background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"14px 0", color:C.text, fontSize:13, fontWeight:800, cursor:"pointer" }}>🧮 Split Bill</button>
          <button style={{ flex:2, background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>Place Group Order</button>
        </div>
      </div>
    </div>
  );
}

/* ─── MEAL PLAN ─────────────────────────────────────────────────────────── */
function MealPlanScreen({ go }) {
  const [selected, setSelected] = useState("regular");
  const [done, setDone] = useState(false);

  if(done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:24, paddingBottom:90 }}>
      <div style={{ fontSize:70 }}>✅</div>
      <h2 style={{ margin:0, fontWeight:900, color:C.text, fontSize:24 }}>Subscribed!</h2>
      <p style={{ margin:0, color:C.sub, fontSize:13, textAlign:"center", lineHeight:1.6 }}>Your {MEAL_PLANS.find(p=>p.id===selected)?.name} plan is active. Your first meal delivery will be scheduled shortly.</p>
      <button onClick={()=>go("home")} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:12 }}>Back Home</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.green},#388E3C)`, padding:"24px 18px 28px" }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>📋 Meal Subscription</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:12 }}>Regular Tasty Fingers meals delivered to you</p>
      </div>

      <div style={{ padding:"20px 18px" }}>
        {MEAL_PLANS.map(plan=>(
          <div key={plan.id} onClick={()=>setSelected(plan.id)} style={{ background:selected===plan.id?plan.bg:C.white, border:`2px solid ${selected===plan.id?plan.color:C.border}`, borderRadius:20, padding:18, marginBottom:12, cursor:"pointer", transition:"all 0.2s" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <Pill bg={`${plan.color}18`} color={plan.color}>{plan.badge}</Pill>
                <h3 style={{ margin:"8px 0 2px", fontWeight:900, color:C.text, fontSize:20 }}>{plan.name}</h3>
                <p style={{ margin:0, color:C.sub, fontSize:12 }}>{plan.meals} meals · {plan.perWeek}× per week</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:plan.color, fontSize:22 }}>{fmt(plan.price)}</p>
                <p style={{ margin:0, color:C.sub, fontSize:11 }}>per month</p>
              </div>
            </div>
            <div style={{ height:2, background:`${plan.color}22`, borderRadius:99, marginBottom:10 }}/>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[`${plan.meals} meals/month`,`${plan.perWeek}× per week`,"Free delivery","₦200 per meal saved"].map(f=>(
                <div key={f} style={{ display:"flex", gap:6, alignItems:"center" }}>
                  <span style={{ color:plan.color, fontSize:12 }}>✓</span>
                  <span style={{ fontSize:11, color:C.text, fontWeight:600 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button onClick={()=>setDone(true)} style={{ width:"100%", background:`linear-gradient(135deg,${C.green},#388E3C)`, color:"#fff", border:"none", borderRadius:16, padding:"18px 0", fontSize:15, fontWeight:900, cursor:"pointer", marginTop:8, boxShadow:`0 8px 24px ${C.green}44` }}>
          Subscribe to {MEAL_PLANS.find(p=>p.id===selected)?.name} Plan · {fmt(MEAL_PLANS.find(p=>p.id===selected)?.price)}/mo
        </button>
      </div>
    </div>
  );
}

/* ─── SPLIT BILL ────────────────────────────────────────────────────────── */
function SplitBillScreen({ go, cart }) {
  const [people, setPeople] = useState(2);
  const [tipPct, setTipPct] = useState(0);
  const [names, setNames] = useState(["You","Friend 2"]);

  const subtotal = cart.reduce((a,i)=>a+i.price*i.qty,0) || 20000;
  const delivery = 1000;
  const tip = Math.round(subtotal*(tipPct/100));
  const total = subtotal + delivery + tip;
  const perPerson = Math.round(total/people);

  const updatePeople = (n) => {
    setPeople(n);
    setNames(Array.from({length:n},(_, i)=>names[i]||`Person ${i+1}`));
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:C.white, padding:"20px 18px 18px", borderBottom:`1px solid ${C.border}` }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.text }}>🧮 Split Bill</h2>
        <p style={{ margin:0, color:C.sub, fontSize:12 }}>Divide the bill fairly among your group</p>
      </div>

      <div style={{ padding:"20px 18px" }}>
        <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, borderRadius:20, padding:20, marginBottom:16, textAlign:"center" }}>
          <p style={{ margin:"0 0 4px", color:"rgba(255,255,255,0.7)", fontSize:12 }}>Total Bill</p>
          <p style={{ margin:"0 0 16px", color:"#fff", fontWeight:900, fontSize:36, lineHeight:1 }}>{fmt(total)}</p>
          <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"12px 16px" }}>
            <p style={{ margin:"0 0 12px", color:"rgba(255,255,255,0.8)", fontSize:22, fontWeight:900 }}>{fmt(perPerson)} <span style={{ fontSize:13, fontWeight:600 }}>per person</span></p>
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              {["🍽 Subtotal","🛵 Delivery","✨ Tip"].map((l,i)=>(
                <div key={l} style={{ textAlign:"center" }}>
                  <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.6)", fontSize:9 }}>{l}</p>
                  <p style={{ margin:0, color:"#fff", fontWeight:800, fontSize:12 }}>{fmt([subtotal,delivery,tip][i])}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <p style={{ margin:0, fontWeight:900, color:C.text, fontSize:14 }}>👥 How many people?</p>
            <span style={{ fontWeight:900, color:C.accent, fontSize:18 }}>{people}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"center" }}>
            <button onClick={()=>updatePeople(Math.max(2,people-1))} style={{ width:44, height:44, borderRadius:99, background:C.cream, border:`2px solid ${C.border}`, fontSize:22, cursor:"pointer" }}>−</button>
            <div style={{ display:"flex", gap:6 }}>
              {Array.from({length:Math.min(people,6)}).map((_,i)=>(
                <div key={i} style={{ width:32, height:32, borderRadius:99, background:`linear-gradient(135deg,#C0290A,#E63939)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>👤</div>
              ))}
              {people>6&&<div style={{ width:32, height:32, borderRadius:99, background:C.cream, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:C.sub }}>+{people-6}</div>}
            </div>
            <button onClick={()=>updatePeople(Math.min(20,people+1))} style={{ width:44, height:44, borderRadius:99, background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", fontSize:22, cursor:"pointer", color:"#fff", fontWeight:900 }}>+</button>
          </div>
        </div>

        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:18, marginBottom:14 }}>
          <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:14 }}>✨ Add a Tip?</p>
          <div style={{ display:"flex", gap:8 }}>
            {[0,5,10,15,20].map(pct=>(
              <button key={pct} onClick={()=>setTipPct(pct)} style={{ flex:1, background:tipPct===pct?C.accent:C.cream, border:`1.5px solid ${tipPct===pct?C.accent:C.border}`, borderRadius:12, padding:"10px 0", color:tipPct===pct?"#fff":C.sub, fontSize:11, fontWeight:900, cursor:"pointer" }}>{pct===0?"None":`${pct}%`}</button>
            ))}
          </div>
        </div>

        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:14 }}>
          <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:14 }}>💬 Names</p>
          {names.map((n,i)=>(
            <div key={i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:99, background:i===0?`linear-gradient(135deg,#C0290A,#E63939)`:C.cream, border:`1.5px solid ${i===0?C.accent:C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{i===0?"👑":"👤"}</div>
              <input value={n} onChange={e=>setNames(ns=>ns.map((x,j)=>j===i?e.target.value:x))} style={{ flex:1, background:C.cream, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 12px", fontSize:13, fontWeight:700, color:C.text, outline:"none" }}/>
              <span style={{ fontWeight:900, color:C.accent, fontSize:13, minWidth:70, textAlign:"right" }}>{fmt(perPerson)}</span>
            </div>
          ))}
        </div>

        <button style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:16, padding:"16px 0", fontSize:14, fontWeight:900, cursor:"pointer", marginBottom:10 }}>
          📨 Send Split Request In-App — {fmt(perPerson)} each
        </button>
        <button style={{ width:"100%", background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:16, padding:"14px 0", fontSize:13, fontWeight:800, color:C.text, cursor:"pointer" }}>
          📋 Copy Summary
        </button>
      </div>
    </div>
  );
}

/* ─── BIRTHDAY / EVENTS ──────────────────────────────────────────────────── */
function BirthdayScreen({ go }) {
  const [events, setEvents] = useState([
    { id:1, name:"Mama's Birthday", date:"2025-08-14", type:"birthday", reminder:true },
    { id:2, name:"Office Anniversary", date:"2025-07-01", type:"anniversary", reminder:false },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", date:"", type:"birthday" });

  const TYPES = [
    { id:"birthday",    icon:"🎂", label:"Birthday" },
    { id:"anniversary", icon:"💍", label:"Anniversary" },
    { id:"graduation",  icon:"🎓", label:"Graduation" },
    { id:"other",       icon:"🎉", label:"Other" },
  ];

  const getDaysUntil = d => {
    const today = new Date(), target = new Date(d);
    target.setFullYear(today.getFullYear());
    if(target<today) target.setFullYear(today.getFullYear()+1);
    return Math.ceil((target-today)/(1000*60*60*24));
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#C0290A,#E63939)", padding:"20px 18px 28px" }}>
        <BackBtn go={go} screen="profile"/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:46, height:46, borderRadius:14, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🎂</div>
          <div>
            <h2 style={{ margin:"0 0 2px", color:"#fff", fontSize:22, fontWeight:900 }}>Celebrations</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.75)", fontSize:12 }}>Never miss a special occasion</p>
          </div>
        </div>
      </div>

      <div style={{ margin:"16px 18px 0", background:C.cream, border:`2px dashed ${C.gold}`, borderRadius:18, padding:16 }}>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <span style={{ fontSize:28 }}>🎁</span>
          <div>
            <p style={{ margin:"0 0 2px", fontWeight:900, color:C.gold, fontSize:13 }}>Birthday Perk Active!</p>
            <p style={{ margin:0, color:C.sub, fontSize:11, lineHeight:1.5 }}>On your birthday month, get a <strong>FREE dessert</strong> with any meal order above ₦4,000.</p>
          </div>
        </div>
      </div>

      <div style={{ padding:"16px 18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ margin:0, fontWeight:900, color:C.text, fontSize:16 }}>Your Events</p>
          <button onClick={()=>setShowAdd(true)} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer" }}>+ Add</button>
        </div>
        {events.map(e=>{
          const days = getDaysUntil(e.date);
          const type = TYPES.find(t=>t.id===e.type);
          const urgent = days<=14;
          return (
            <div key={e.id} style={{ background:C.white, border:`1.5px solid ${urgent?C.gold:C.border}`, borderRadius:18, padding:16, marginBottom:12, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:48, height:48, borderRadius:14, background:urgent?"#1A1200":C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{type?.icon}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:14 }}>{e.name}</p>
                <p style={{ margin:"0 0 4px", color:C.sub, fontSize:11 }}>{new Date(e.date+"T12:00").toLocaleDateString("en-NG",{day:"numeric",month:"long"})}</p>
                <div style={{ display:"flex", gap:6 }}>
                  <Tag text={`${days} days away`} color={urgent?C.gold:C.sub} bg={urgent?"#1A1200":C.cream}/>
                  {urgent&&<Tag text="Coming soon!" color={C.gold} bg="#FFFBF0"/>}
                </div>
              </div>
              <div onClick={()=>setEvents(ev=>ev.map(x=>x.id===e.id?{...x,reminder:!x.reminder}:x))} style={{ width:38, height:22, borderRadius:99, background:e.reminder?C.accent:C.border, cursor:"pointer", position:"relative", transition:"all 0.2s", flexShrink:0 }}>
                <div style={{ position:"absolute", top:2, left:e.reminder?18:2, width:18, height:18, borderRadius:99, background:"#fff", transition:"all 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }}/>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={()=>setShowAdd(false)}>
          <div onClick={e=>e.stopPropagation()} style={{ width:420, background:"#FAF7F0", borderRadius:"24px 24px 0 0", padding:24, paddingBottom:40 }}>
            <h3 style={{ margin:"0 0 16px", fontWeight:900, color:C.text }}>Add Celebration</h3>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
              <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Event Name</p>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Dad's 60th Birthday" style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontWeight:700, width:"100%" }}/>
            </div>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
              <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Date</p>
              <input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontWeight:700, width:"100%", colorScheme:"light" }}/>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
              {TYPES.map(t=>(
                <button key={t.id} onClick={()=>setForm(f=>({...f,type:t.id}))} style={{ background:form.type===t.id?C.cream:C.white, border:`2px solid ${form.type===t.id?C.accent:C.border}`, borderRadius:12, padding:"10px 8px", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:18 }}>{t.icon}</span>
                  <span style={{ fontSize:11, fontWeight:800, color:form.type===t.id?C.accent:C.text }}>{t.label}</span>
                </button>
              ))}
            </div>
            <button onClick={()=>{ if(!form.name||!form.date) return; setEvents(e=>[...e,{...form,id:Date.now(),reminder:true}]); setForm({name:"",date:"",type:"birthday"}); setShowAdd(false); }} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:14, padding:"16px 0", fontSize:14, fontWeight:900, cursor:"pointer" }}>Save Event ✓</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CATERING ──────────────────────────────────────────────────────────── */
function CateringScreen({ go }) {
  const [step, setStep] = useState(1);
  const [event, setEvent] = useState("");
  const [guests, setGuests] = useState(50);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [done, setDone] = useState(false);

  const EVENTS = [
    { id:"wedding",     icon:"💒", label:"Wedding" },
    { id:"corporate",   icon:"💼", label:"Corporate" },
    { id:"birthday",    icon:"🎂", label:"Birthday Party" },
    { id:"burial",      icon:"🕊",  label:"Burial" },
    { id:"naming",      icon:"👶", label:"Naming Ceremony" },
    { id:"graduation",  icon:"🎓", label:"Graduation" },
  ];

  const estimate = guests * 3500;

  if(done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:24 }}>
      <div style={{ fontSize:70 }}>🎉</div>
      <h2 style={{ margin:0, fontWeight:900, color:C.text, fontSize:24, textAlign:"center" }}>Enquiry Sent!</h2>
      <p style={{ margin:0, color:C.sub, fontSize:13, textAlign:"center", lineHeight:1.7 }}>Our catering team will call you within 24 hours to discuss your event. You'll receive a confirmation notification in the app.</p>
      <button onClick={()=>{setDone(false);setStep(1);}} style={{ background:`linear-gradient(135deg,${C.green},#388E3C)`, border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:8 }}>Done</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,${C.green},#388E3C)`, padding:"24px 18px 24px" }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:24, fontWeight:900 }}>🎉 Catering & Events</h2>
        <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.75)", fontSize:12 }}>We cook for your crowd — weddings to birthdays</p>
        <div style={{ display:"flex", gap:4 }}>
          {[1,2,3].map(s=>(
            <div key={s} style={{ flex:1, height:4, borderRadius:99, background:s<=step?"#fff":"rgba(255,255,255,0.3)" }}/>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 18px" }}>
        {step===1&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Event Type & Size</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {EVENTS.map(e=>(
                <button key={e.id} onClick={()=>setEvent(e.id)} style={{ background:event===e.id?C.cream:C.white, border:`2px solid ${event===e.id?C.green:C.border}`, borderRadius:16, padding:14, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:28 }}>{e.icon}</span>
                  <span style={{ fontSize:12, fontWeight:800, color:event===e.id?C.green:C.text }}>{e.label}</span>
                </button>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, margin:"0 0 16px" }}>
              <button onClick={()=>setGuests(g=>Math.max(20,g-10))} style={{ width:44, height:44, borderRadius:99, background:C.cream, border:`2px solid ${C.border}`, fontSize:22, cursor:"pointer" }}>−</button>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:48, fontWeight:900, color:C.green, lineHeight:1 }}>{guests}</div>
                <div style={{ color:C.sub, fontSize:13 }}>Guests</div>
              </div>
              <button onClick={()=>setGuests(g=>Math.min(500,g+10))} style={{ width:44, height:44, borderRadius:99, background:C.green, border:"none", fontSize:22, cursor:"pointer", color:"#fff", fontWeight:900 }}>+</button>
            </div>
            <div style={{ background:"#F0FFF0", border:"1px solid #0A3D25", borderRadius:14, padding:14 }}>
              <p style={{ margin:"0 0 2px", color:C.green, fontWeight:900, fontSize:13 }}>Estimated Budget</p>
              <p style={{ margin:0, color:C.green, fontWeight:900, fontSize:22 }}>{fmt(estimate)}+</p>
            </div>
          </>
        )}
        {step===2&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Event Details</p>
            {[
              { label:"Full Name",    val:name,     set:setName,     ph:"Your name" },
              { label:"Phone Number",  val:phone,    set:setPhone,    ph:"+234 800 000 0000" },
              { label:"Venue",        val:location, set:setLocation, ph:"Event venue / address" },
            ].map(f=>(
              <div key={f.label} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
                <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>{f.label}</p>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontWeight:700, width:"100%" }}/>
              </div>
            ))}
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
              <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Event Date</p>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:14, fontWeight:700, width:"100%", colorScheme:"light" }}/>
            </div>
          </>
        )}
        {step===3&&(
          <>
            <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>Confirm & Submit</p>
            <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:16, marginBottom:14 }}>
              {[["Event",EVENTS.find(e=>e.id===event)?.label||"—"],["Guests",guests+" guests"],["Date",date||"—"],["Venue",location||"—"],["Contact",name+" · "+phone],["Est. Budget",fmt(estimate)+"+"]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <span style={{ color:C.sub, fontSize:12 }}>{l}</span>
                  <span style={{ fontWeight:800, color:C.text, fontSize:12, maxWidth:"60%", textAlign:"right" }}>{v}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ display:"flex", gap:12, marginTop:12 }}>
          {step>1&&<button onClick={()=>setStep(s=>s-1)} style={{ flex:1, background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"15px 0", color:C.text, fontSize:13, fontWeight:800, cursor:"pointer" }}>← Back</button>}
          <button onClick={()=>{if(step<3)setStep(s=>s+1);else setDone(true);}} style={{ flex:2, background:`linear-gradient(135deg,${C.green},#388E3C)`, color:"#fff", border:"none", borderRadius:14, padding:"15px 0", fontSize:14, fontWeight:900, cursor:"pointer" }}>
            {step<3?"Continue →":"Submit Enquiry ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── QUEUE SCREEN ──────────────────────────────────────────────────────── */
function QueueScreen({ go }) {
  const [joined, setJoined] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [position] = useState(9);
  const [timer, setTimer] = useState(0);

  useEffect(()=>{
    if(!joined) return;
    const t = setInterval(()=>setTimer(s=>s+1),1000);
    return()=>clearInterval(t);
  },[joined]);

  const waitMins = Math.round(position * 3.5);

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:C.white, padding:"20px 18px 20px", borderBottom:`1px solid ${C.border}` }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.text }}>🕐 Kitchen Queue</h2>
        <p style={{ margin:0, color:C.sub, fontSize:12 }}>Join the live queue — we'll notify you when ready</p>
      </div>

      <div style={{ padding:"20px 18px" }}>
        <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, borderRadius:20, padding:20, marginBottom:16, textAlign:"center" }}>
          <Pill bg="rgba(255,255,255,0.25)" color="#fff">🔴 Kitchen Live</Pill>
          <div style={{ fontSize:56, fontWeight:900, color:"#fff", lineHeight:1, margin:"14px 0 4px" }}>{position}</div>
          <p style={{ margin:"0 0 16px", color:"rgba(255,255,255,0.85)", fontSize:14 }}>orders ahead in queue</p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[["⏱ Est. Wait", `${waitMins} mins`],["🍽 Orders Today","47 served"]].map(([l,v])=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.15)", borderRadius:12, padding:10 }}>
                <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.7)", fontSize:10 }}>{l}</p>
                <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:16 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {!joined?(
          <>
            {[
              { label:"Your Name",       placeholder:"First name",        val:name,  set:setName },
              { label:"Phone Number",    placeholder:"+234 800 000 0000", val:phone, set:setPhone },
            ].map(f=>(
              <div key={f.label} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:12 }}>
                <p style={{ margin:"0 0 6px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>{f.label}</p>
                <input value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700, width:"100%" }}/>
              </div>
            ))}
            <button onClick={()=>{if(name&&phone)setJoined(true);}} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:14, padding:"16px 0", fontSize:14, fontWeight:900, cursor:"pointer", opacity:name&&phone?1:0.6 }}>
              Join Queue
            </button>
          </>
        ):(
          <div style={{ background:C.white, border:`2px solid ${C.green}`, borderRadius:20, padding:20, textAlign:"center" }}>
            <div style={{ fontSize:50, marginBottom:12 }}>✅</div>
            <p style={{ margin:"0 0 4px", fontWeight:900, color:C.text, fontSize:18 }}>You're in the queue, {name}!</p>
            <p style={{ margin:"0 0 14px", color:C.sub, fontSize:13 }}>Position #{position+1} · ~{waitMins} min wait</p>
            <p style={{ margin:"0 0 4px", color:C.green, fontSize:12, fontWeight:700 }}>We'll send you an in-app notification when it's your turn.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── GALLERY SCREEN ────────────────────────────────────────────────────── */
function GalleryScreen({ go }) {
  const [active, setActive] = useState("all");
  const [liked, setLiked] = useState({});
  const [view, setView] = useState(null);
  const CATS = ["all","food","vibes"];
  const shown = active==="all" ? GALLERY_ITEMS : GALLERY_ITEMS.filter(g=>g.category===active);
  const colors = ["#0F1A35","#0A1F18","#0A1020","#1A1000","#1A0A20","#1A1040"];

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      {view && (
        <div onClick={()=>setView(null)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16, padding:24 }}>
          <div style={{ width:200, height:200, borderRadius:28, background:colors[view.id%colors.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:100 }}>{view.emoji}</div>
          <p style={{ color:"#fff", fontWeight:900, fontSize:20 }}>{view.label}</p>
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:12, padding:"8px 16px", color:"#fff", fontSize:13, fontWeight:700 }}>❤️ {view.likes+(liked[view.id]?1:0)} likes</div>
            <Pill bg={C.accent} color="#fff">{view.category==="food"?"🍽 Food":"✨ Vibes"}</Pill>
          </div>
        </div>
      )}
      <div style={{ background:C.white, padding:"20px 18px 16px", borderBottom:`1px solid ${C.border}` }}>
        <BackBtn go={go}/>
        <h2 style={{ margin:"0 0 4px", fontSize:24, fontWeight:900, color:C.text }}>📸 Food Gallery</h2>
        <p style={{ margin:"0 0 14px", fontSize:12, color:C.sub }}>From our kitchen to your eyes 🔥</p>
        <div style={{ display:"flex", gap:8 }}>
          {CATS.map(c=>(
            <button key={c} onClick={()=>setActive(c)} style={{ background:active===c?C.accent:C.cream, border:active===c?"none":`1.5px solid ${C.border}`, borderRadius:99, padding:"7px 16px", color:active===c?"#fff":C.sub, fontSize:11, fontWeight:800, cursor:"pointer", textTransform:"capitalize" }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"14px 18px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
          {shown.map((g,i)=>(
            <div key={g.id} style={{ position:"relative", borderRadius:16, overflow:"hidden", cursor:"pointer" }} onClick={()=>setView(g)}>
              <div style={{ background:colors[g.id%colors.length], borderRadius:16, aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", fontSize:i===0||i===4?"52px":"40px" }}>{g.emoji}</div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(transparent,rgba(0,0,0,0.55))", borderRadius:"0 0 16px 16px", padding:"16px 8px 8px" }}>
                <p style={{ margin:"0 0 2px", color:"#fff", fontSize:9, fontWeight:800, lineHeight:1.2 }}>{g.label}</p>
                <button onClick={e=>{e.stopPropagation();setLiked(l=>({...l,[g.id]:!l[g.id]}));}} style={{ background:"none", border:"none", cursor:"pointer", padding:0, color:liked[g.id]?"#FF4D6D":"rgba(255,255,255,0.8)", fontSize:12, fontWeight:800 }}>
                  {liked[g.id]?"❤️":"🤍"} {g.likes+(liked[g.id]?1:0)}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── AI COMBO SCREEN ───────────────────────────────────────────────────── */
function AIComboScreen({ go, setCart }) {
  const { apiKey } = useApiKey();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState("");
  const [budget, setBudget] = useState(10000);
  const [dietary, setDietary] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const MOODS = [
    { id:"hungry",  icon:"🔥", label:"Very Hungry",  desc:"Full meal" },
    { id:"light",   icon:"🌿", label:"Light Bite",    desc:"Snack-size" },
    { id:"healthy", icon:"💪", label:"Eating Healthy",desc:"Nutritious" },
    { id:"treat",   icon:"🎉", label:"Treating Myself",desc:"Go big!" },
  ];

  const getCombo = async () => {
    setLoading(true);
    setStep(2);
    try {
      const prompt = `You are a food combo recommendation AI for Tasty Fingers restaurant in Nigeria.

Menu: ${JSON.stringify(MENU.map(m=>({id:m.id,name:m.name,price:m.price,cal:m.cal,protein:m.protein,healthy:m.healthy,spice:m.spice})))}

Customer request:
- Mood: ${mood}
- Budget: ₦${budget}
- Dietary preferences: ${dietary.length?dietary.join(", "):"None specified"}

Respond ONLY with a JSON object (no markdown, no explanation outside JSON):
{
  "title": "Short catchy combo name",
  "tagline": "One sentence description",
  "combo": [
    {"id": <menu_id>, "name": "<name>", "price": <price>, "cal": <cal>, "reason": "Brief 1-sentence reason"}
  ],
  "tip": "One helpful food tip or pairing suggestion",
  "totalCal": <total_cal>,
  "totalPrice": <total_price>
}

Pick 2-3 items that fit within the budget. Make the title and tagline exciting and appetizing.`;

      const data = await callAI(apiKey, { messages:[{ role:"user", content:prompt }] });
      const text = data.content?.[0]?.text||"{}";
      const clean = text.replace(/```json|```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch(e) {
      setResult({ title:"Classic Combo", tagline:"A great all-round choice!", combo:[{id:2,name:"Jollof Rice + Grilled Chicken",price:5200,cal:780,reason:"Nigeria's favourite party food"},{id:15,name:"Fresh Fruit Cocktail",price:2500,cal:180,reason:"Perfect refreshing drink pairing"}], tip:"Jollof rice and fresh juice is a classic Nigerian combination!", totalCal:960, totalPrice:7700 });
    }
    setLoading(false);
  };

  const addComboToCart = () => {
    if(!result?.combo) return;
    result.combo.forEach(c => {
      const item = MENU.find(m=>m.id===c.id);
      if(item) setCart(prev=>{
        const ex=prev.find(x=>x.id===item.id);
        return ex?prev.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...prev,{...item,qty:1}];
      });
    });
    go("cart");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#3D1A00,#8D4E2A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go}/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontSize:36 }}>🤖</div>
          <div>
            <h2 style={{ margin:"0 0 2px", color:"#fff", fontSize:22, fontWeight:900 }}>AI Combo Builder</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:12 }}>Let AI pick your perfect meal combo</p>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 18px" }}>
        {step===1&&(
          <>
            <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:16 }}>How are you feeling?</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
              {MOODS.map(m=>(
                <button key={m.id} onClick={()=>setMood(m.id)} style={{ background:mood===m.id?C.cream:C.white, border:`2px solid ${mood===m.id?C.purple:C.border}`, borderRadius:16, padding:16, cursor:"pointer", textAlign:"left" }}>
                  <div style={{ fontSize:28, marginBottom:6 }}>{m.icon}</div>
                  <p style={{ margin:"0 0 2px", fontWeight:900, color:mood===m.id?C.purple:C.text, fontSize:14 }}>{m.label}</p>
                  <p style={{ margin:0, color:C.sub, fontSize:11 }}>{m.desc}</p>
                </button>
              ))}
            </div>

            <p style={{ margin:"0 0 8px", fontWeight:900, color:C.text, fontSize:14 }}>Budget: {fmt(budget)}</p>
            <input type="range" min={3000} max={20000} step={500} value={budget} onChange={e=>setBudget(Number(e.target.value))} style={{ width:"100%", marginBottom:20, accentColor:C.accent }}/>

            <button onClick={getCombo} disabled={!mood} style={{ width:"100%", background:mood?`linear-gradient(135deg,#8D4E2A,#3D1A00)`:"#ccc", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:mood?"pointer":"not-allowed" }}>
              🤖 Generate My Combo
            </button>
          </>
        )}

        {step===2&&loading&&(
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <div style={{ fontSize:60, marginBottom:16 }}>🤖</div>
            <p style={{ fontWeight:900, color:C.text, fontSize:18 }}>AI is picking your perfect combo...</p>
            <p style={{ color:C.sub, fontSize:12 }}>Analysing menu, nutrition & your budget</p>
          </div>
        )}

        {step===2&&result&&!loading&&(
          <>
            <div style={{ background:"linear-gradient(135deg,#3D1A00,#8D4E2A)", borderRadius:20, padding:20, marginBottom:16 }}>
              <Pill bg="rgba(255,255,255,0.2)" color="#fff">🤖 AI Recommendation</Pill>
              <h3 style={{ margin:"10px 0 4px", color:"#fff", fontSize:20, fontWeight:900 }}>{result.title}</h3>
              <p style={{ margin:"0 0 14px", color:"rgba(255,255,255,0.75)", fontSize:13 }}>{result.tagline}</p>
              <div style={{ display:"flex", gap:10 }}>
                <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
                  <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.7)", fontSize:10 }}>Total</p>
                  <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:16 }}>{fmt(result.totalPrice)}</p>
                </div>
                <div style={{ background:"rgba(255,255,255,0.12)", borderRadius:10, padding:"8px 14px", textAlign:"center" }}>
                  <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.7)", fontSize:10 }}>Calories</p>
                  <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:16 }}>{result.totalCal} kcal</p>
                </div>
              </div>
            </div>

            {result.combo?.map(c=>{
              const item=MENU.find(m=>m.id===c.id);
              return (
                <div key={c.id} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:12, display:"flex", gap:14 }}>
                  <div style={{ width:66, height:66, borderRadius:14, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, flexShrink:0 }}>{item?.emoji}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:14 }}>{c.name}</p>
                    <p style={{ margin:"0 0 6px", fontSize:11, color:C.sub, lineHeight:1.5 }}>{c.reason}</p>
                    <div style={{ display:"flex", gap:8 }}>
                      <Tag text={`${c.cal} kcal`} color={C.sub} bg={C.cream}/>
                      <Tag text={fmt(c.price)} color={C.accent} bg="#FFF4EC"/>
                    </div>
                  </div>
                </div>
              );
            })}

            {result.tip&&(
              <div style={{ background:"#F0FFF0", border:"1px solid #0A3D25", borderRadius:14, padding:14, marginBottom:16, display:"flex", gap:10 }}>
                <span style={{ fontSize:20 }}>💡</span>
                <p style={{ margin:0, color:C.green, fontSize:12, lineHeight:1.6, fontWeight:700 }}>{result.tip}</p>
              </div>
            )}

            <button onClick={addComboToCart} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:16, padding:"18px 0", fontSize:14, fontWeight:900, cursor:"pointer", marginBottom:10 }}>
              🛒 Add This Combo to Cart
            </button>
            <button onClick={()=>{setResult(null);setStep(1);setMood("");}} style={{ width:"100%", background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:16, padding:"14px 0", fontSize:13, fontWeight:800, color:C.text, cursor:"pointer" }}>
              🔄 Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── NEW: FOOD STORIES BANNER ──────────────────────────────────────────── */
function FoodStoriesBanner({ go }) {
  const [active, setActive] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  useEffect(()=>{
    const t = setInterval(()=>setActive(a=>(a+1)%FOOD_STORIES.length), 4000);
    return()=>clearInterval(t);
  },[]);
  if(dismissed) return null;
  const s = FOOD_STORIES[active];
  return (
    <div style={{ margin:"14px 18px 0", position:"relative" }}>
      <div style={{ background:s.bg, borderRadius:20, padding:"18px 18px 18px", cursor:"pointer", overflow:"hidden", position:"relative", minHeight:96, transition:"all 0.4s" }} onClick={()=>go(s.screen)}>
        <button onClick={e=>{e.stopPropagation();setDismissed(true);}} style={{ position:"absolute", top:10, right:12, background:"rgba(255,255,255,0.2)", border:"none", borderRadius:99, width:26, height:26, cursor:"pointer", color:"#fff", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        <div style={{ position:"absolute", right:-16, top:-16, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ fontSize:42, flexShrink:0 }}>{s.emoji}</div>
          <div style={{ flex:1 }}>
            <p style={{ margin:"0 0 3px", fontWeight:900, color:"#fff", fontSize:15 }}>{s.title}</p>
            <p style={{ margin:"0 0 8px", color:"rgba(255,255,255,0.8)", fontSize:11, lineHeight:1.4 }}>{s.body}</p>
            <span style={{ background:"rgba(255,255,255,0.25)", color:"#fff", borderRadius:99, padding:"4px 12px", fontSize:10, fontWeight:800 }}>{s.cta} →</span>
          </div>
        </div>
        <div style={{ display:"flex", gap:4, marginTop:12 }}>
          {FOOD_STORIES.map((_,i)=>(
            <div key={i} onClick={e=>{e.stopPropagation();setActive(i);}} style={{ flex:1, height:3, borderRadius:99, background:i===active?"#fff":"rgba(255,255,255,0.3)", cursor:"pointer" }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── NEW: LIVE ORDER TRACKER ────────────────────────────────────────────── */
function LiveTrackerScreen({ go, orderId="TF-2024-083" }) {
  const [stage, setStage] = useState(1);
  const [eta, setEta] = useState(38);
  useEffect(()=>{
    const t = setInterval(()=>{
      setStage(s=> s<4 ? s+1 : s);
      setEta(e=> e>2 ? e-3 : e);
    }, 5000);
    return()=>clearInterval(t);
  },[]);
  const stageIcons = ["✅","👨‍🍳","📦","🛵","🎉"];
  const stageColors = [C.sub, C.accent, C.accent2, C.blue, C.green];
  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="orders"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:22, fontWeight:900 }}>🛵 Live Order Tracker</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.8)", fontSize:12 }}>Order {orderId}</p>
      </div>

      {/* ETA Card */}
      <div style={{ margin:"20px 18px 0", background:"#FFF4EC", borderRadius:22, padding:22, textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 50% 0%, rgba(232,69,10,0.3), transparent 70%)" }}/>
        <p style={{ margin:"0 0 4px", color:"rgba(255,255,255,0.6)", fontSize:12 }}>Estimated Arrival</p>
        <p style={{ margin:"0 0 6px", color:"#fff", fontWeight:900, fontSize:48, lineHeight:1 }}>{eta}<span style={{ fontSize:18 }}> min</span></p>
        <div style={{ display:"inline-flex", gap:8, background:"rgba(255,255,255,0.08)", borderRadius:99, padding:"6px 14px" }}>
          <span style={{ fontSize:20 }}>{stageIcons[stage]}</span>
          <span style={{ color:"#fff", fontSize:13, fontWeight:800 }}>{ORDER_STAGES[stage]}</span>
        </div>
      </div>

      {/* Stage Timeline */}
      <div style={{ padding:"22px 18px" }}>
        <p style={{ margin:"0 0 16px", fontWeight:900, color:C.text, fontSize:15 }}>Order Progress</p>
        {ORDER_STAGES.map((s,i)=>{
          const done = i <= stage;
          const active2 = i === stage;
          return (
            <div key={s} style={{ display:"flex", gap:14, alignItems:"flex-start", marginBottom:i<ORDER_STAGES.length-1?0:0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:38, height:38, borderRadius:99, background:done?(active2?`linear-gradient(135deg,#C0290A,#E63939)`:C.green):C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, transition:"all 0.4s", boxShadow:active2?`0 4px 16px ${C.accent}66`:"none" }}>
                  {done ? (active2 ? stageIcons[i] : "✓") : <span style={{ color:C.sub, fontSize:12 }}>{i+1}</span>}
                </div>
                {i<ORDER_STAGES.length-1&&<div style={{ width:2, height:36, background:i<stage?C.green:C.border, marginTop:2, transition:"all 0.4s" }}/>}
              </div>
              <div style={{ paddingTop:8 }}>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:done?C.text:C.sub, fontSize:14 }}>{s}</p>
                <p style={{ margin:0, color:C.sub, fontSize:11 }}>
                  {i===0?"Order received & confirmed"
                   :i===1?"Chef is preparing your food"
                   :i===2?"Packed and ready for pickup"
                   :i===3?"Rider is on the way to you"
                   :"Enjoy your meal! 🎉"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map placeholder */}
      <div style={{ margin:"0 18px 18px", background:"linear-gradient(135deg,#8B1A0A,#C0290A)", borderRadius:20, padding:20, textAlign:"center", minHeight:120, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
        <span style={{ fontSize:40 }}>🗺</span>
        <p style={{ margin:0, color:"rgba(255,255,255,0.8)", fontSize:13, fontWeight:700 }}>Live map coming soon</p>
        <p style={{ margin:0, color:"rgba(255,255,255,0.5)", fontSize:11 }}>Your rider is 2.3 km away</p>
      </div>

      <div style={{ padding:"0 18px" }}>
        <button style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"15px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>
          💬 Chat with Rider In-App
        </button>
      </div>
    </div>
  );
}

/* ─── NEW: LOYALTY STREAK SCREEN ─────────────────────────────────────────── */
function StreakScreen({ go }) {
  const { current, longest, thisWeek } = STREAK_DATA;
  const days = ["M","T","W","T","F","S","S"];
  const visited = [true,true,true,true,true,false,false]; // this week

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#C0290A,#E63939)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="profile"/>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:42 }}>🔥</span>
          <div>
            <h2 style={{ margin:"0 0 2px", color:"#fff", fontSize:24, fontWeight:900 }}>Your Streak</h2>
            <p style={{ margin:0, color:"rgba(255,255,255,0.8)", fontSize:12 }}>Keep ordering to earn bonus points</p>
          </div>
        </div>
      </div>

      {/* Big streak number */}
      <div style={{ margin:"20px 18px 0", background:"#FFF4EC", borderRadius:22, padding:28, textAlign:"center" }}>
        <p style={{ margin:"0 0 0px", color:"rgba(255,255,255,0.6)", fontSize:13 }}>Current Streak</p>
        <p style={{ margin:"0 0 4px", color:"#FFC107", fontWeight:900, fontSize:72, lineHeight:1 }}>{current}🔥</p>
        <p style={{ margin:0, color:"rgba(255,255,255,0.7)", fontSize:12 }}>days in a row</p>
        <div style={{ marginTop:16, background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 16px", display:"inline-block" }}>
          <p style={{ margin:0, color:"#FFC107", fontWeight:800, fontSize:13 }}>+50 bonus points per day! 🎁</p>
        </div>
      </div>

      {/* Weekly grid */}
      <div style={{ margin:"16px 18px 0", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:18, padding:18 }}>
        <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:14 }}>This Week</p>
        <div style={{ display:"flex", gap:6, justifyContent:"space-between" }}>
          {days.map((d,i)=>(
            <div key={i} style={{ flex:1, textAlign:"center" }}>
              <div style={{ width:"100%", aspectRatio:"1", borderRadius:10, background:visited[i]?`linear-gradient(135deg,#C8860A,#FFC107)`:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, marginBottom:4 }}>
                {visited[i]?"🔥":""}
              </div>
              <span style={{ fontSize:9, fontWeight:800, color:visited[i]?C.gold:C.sub }}>{d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ margin:"14px 18px 0", display:"flex", gap:10 }}>
        {[
          { label:"Current", val:current, icon:"🔥", bg:"#1A1000", color:C.gold },
          { label:"Best Streak", val:longest, icon:"🏆", bg:"#0A1F18", color:C.green },
          { label:"This Week", val:thisWeek, icon:"📅", bg:"#0A1020", color:C.blue },
        ].map(s=>(
          <div key={s.label} style={{ flex:1, background:s.bg, borderRadius:16, padding:14, textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.icon}</div>
            <p style={{ margin:"0 0 2px", fontWeight:900, color:s.color, fontSize:22 }}>{s.val}</p>
            <p style={{ margin:0, color:C.sub, fontSize:9, fontWeight:800, textTransform:"uppercase", letterSpacing:0.5 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ padding:"16px 18px 0" }}>
        <p style={{ margin:"0 0 12px", fontWeight:900, color:C.text, fontSize:14 }}>Streak Badges</p>
        {[
          { days:3,  icon:"🔥", label:"Flame Starter",   earned:true  },
          { days:7,  icon:"⚡", label:"Week Warrior",     earned:true  },
          { days:14, icon:"🏅", label:"Fortnight Fan",    earned:false },
          { days:30, icon:"🏆", label:"Monthly Legend",   earned:false },
        ].map(b=>(
          <div key={b.days} style={{ background:b.earned?C.white:C.cream, border:`1.5px solid ${b.earned?C.gold:C.border}`, borderRadius:14, padding:"14px 16px", marginBottom:10, display:"flex", gap:12, alignItems:"center", opacity:b.earned?1:0.6 }}>
            <div style={{ width:44, height:44, borderRadius:14, background:b.earned?"#1A1200":C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24 }}>{b.icon}</div>
            <div style={{ flex:1 }}>
              <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{b.label}</p>
              <p style={{ margin:0, color:C.sub, fontSize:11 }}>{b.days} day streak</p>
            </div>
            {b.earned
              ? <Pill bg="#FFFBF0" color={C.gold}>✓ Earned</Pill>
              : <Pill bg={C.cream} color={C.sub}>{b.days - current} days to go</Pill>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── NEW: TABLE DINE-IN / QR SCAN MODE ─────────────────────────────────── */
function DineInScreen({ go, cart, setCart }) {
  const [tableNum, setTableNum] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const addToCart = (item) => setCart(c=>{
    const ex=c.find(x=>x.id===item.id);
    return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}];
  });

  if(ordered) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:24 }}>
      <div style={{ fontSize:72 }}>🍽</div>
      <h2 style={{ margin:0, fontWeight:900, color:C.text, fontSize:24, textAlign:"center" }}>Order Sent to Kitchen!</h2>
      <p style={{ margin:0, color:C.sub, fontSize:14, textAlign:"center" }}>Table {tableNum} — your food is being prepared right now.</p>
      <p style={{ margin:0, color:C.sub, fontSize:12, textAlign:"center" }}>Est. wait: <strong>15–20 minutes</strong></p>
      <button onClick={()=>{setOrdered(false);setCart([]);go("home");}} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:8 }}>
        Back Home
      </button>
    </div>
  );

  if(!confirmed) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="home"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:22, fontWeight:900 }}>📱 Dine-In Order</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.8)", fontSize:12 }}>Order from your table — no waiter needed</p>
      </div>
      <div style={{ padding:"28px 18px" }}>
        {/* Simulated QR scan */}
        <div style={{ background:"#FFF4EC", borderRadius:22, padding:28, textAlign:"center", marginBottom:20 }}>
          <div style={{ width:140, height:140, borderRadius:16, background:"#fff", margin:"0 auto 16px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:2, width:100, height:100 }}>
              {Array.from({length:49}).map((_,i)=>(
                <div key={i} style={{ background:Math.random()>0.5?"#E6393922":"transparent", borderRadius:1 }}/>
              ))}
            </div>
          </div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:12 }}>Or enter your table number manually:</p>
        </div>

        <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:15 }}>Your Table Number</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
          {Array.from({length:12},(_,i)=>i+1).map(n=>(
            <button key={n} onClick={()=>setTableNum(String(n))} style={{ background:tableNum===String(n)?C.accent:C.white, border:`2px solid ${tableNum===String(n)?C.accent:C.border}`, borderRadius:12, padding:"14px 0", color:tableNum===String(n)?"#fff":C.text, fontSize:16, fontWeight:900, cursor:"pointer" }}>{n}</button>
          ))}
        </div>
        <button onClick={()=>{ if(tableNum) setConfirmed(true); }} disabled={!tableNum} style={{ width:"100%", background:tableNum?`linear-gradient(135deg,#C0290A,#E63939)`:"#ccc", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:tableNum?"pointer":"not-allowed" }}>
          Confirm Table {tableNum} →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:110 }}>
      <div style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, padding:"20px 18px 18px", position:"sticky", top:0, zIndex:50 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ margin:"0 0 2px", color:"rgba(255,255,255,0.8)", fontSize:11 }}>Dining at</p>
            <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:18 }}>Table {tableNum} 🪑</p>
          </div>
          {cart.length>0&&(
            <div style={{ background:"rgba(255,255,255,0.2)", borderRadius:12, padding:"8px 14px", textAlign:"right" }}>
              <p style={{ margin:"0 0 1px", color:"#fff", fontSize:10 }}>{cart.reduce((a,i)=>a+i.qty,0)} items</p>
              <p style={{ margin:0, color:"#fff", fontWeight:900, fontSize:14 }}>{fmt(cart.reduce((a,i)=>a+i.price*i.qty,0))}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ padding:"14px 18px" }}>
        <p style={{ margin:"0 0 14px", fontWeight:900, color:C.text, fontSize:16 }}>What would you like? 🍽</p>
        {MENU.slice(0,8).map(item=>{
          const inCart=cart.find(x=>x.id===item.id);
          return (
            <div key={item.id} style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:16, padding:14, marginBottom:10, display:"flex", gap:12, alignItems:"center" }}>
              <div style={{ width:54, height:54, borderRadius:12, background:C.cream, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>{item.emoji}</div>
              <div style={{ flex:1 }}>
                <p style={{ margin:"0 0 2px", fontWeight:900, color:C.text, fontSize:13 }}>{item.name}</p>
                <p style={{ margin:0, color:C.accent, fontWeight:900, fontSize:14 }}>{fmt(item.price)}</p>
              </div>
              {inCart?(
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button onClick={()=>setCart(c=>c.map(x=>x.id===item.id?{...x,qty:x.qty-1}:x).filter(x=>x.qty>0))} style={{ width:30, height:30, borderRadius:99, background:C.cream, border:`1.5px solid ${C.border}`, fontSize:16, cursor:"pointer" }}>−</button>
                  <span style={{ fontWeight:900, color:C.accent, fontSize:15, minWidth:16, textAlign:"center" }}>{inCart.qty}</span>
                  <button onClick={()=>addToCart(item)} style={{ width:30, height:30, borderRadius:99, background:C.accent, border:"none", fontSize:16, cursor:"pointer", color:"#fff", fontWeight:900 }}>+</button>
                </div>
              ):(
                <button onClick={()=>addToCart(item)} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:10, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer" }}>+ Add</button>
              )}
            </div>
          );
        })}
      </div>
      {cart.length>0&&(
        <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:420, background:C.white, borderTop:`1.5px solid ${C.border}`, padding:"14px 18px 20px" }}>
          <button onClick={()=>setOrdered(true)} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer" }}>
            🍽 Send Order to Kitchen · {fmt(cart.reduce((a,i)=>a+i.price*i.qty,0))}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── NEW: SCHEDULED ORDER SCREEN ────────────────────────────────────────── */
function ScheduleScreen({ go, cart }) {
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("");
  const [type, setType] = useState("delivery");
  const [done, setDone] = useState(false);

  const days = Array.from({length:3},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()+i);
    return { label: i===0?"Today":i===1?"Tomorrow":d.toLocaleDateString("en-NG",{weekday:"short",day:"numeric"}), date:d };
  });
  const slots = ["10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM"];

  if(done) return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:12, padding:24 }}>
      <div style={{ fontSize:72 }}>⏰</div>
      <h2 style={{ margin:0, fontWeight:900, color:C.text, fontSize:24, textAlign:"center" }}>Order Scheduled!</h2>
      <p style={{ margin:0, color:C.sub, fontSize:14, textAlign:"center" }}>Your order is set for {days[day].label} at {slot}. We'll prepare it fresh for that time.</p>
      <button onClick={()=>go("home")} style={{ background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:14, padding:"14px 28px", color:"#fff", fontSize:14, fontWeight:900, cursor:"pointer", marginTop:8 }}>Back Home</button>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", paddingBottom:90 }}>
      <div style={{ background:"linear-gradient(135deg,#8B1A0A,#C0290A)", padding:"24px 18px 28px" }}>
        <BackBtn go={go} screen="cart"/>
        <h2 style={{ margin:"0 0 4px", color:"#fff", fontSize:22, fontWeight:900 }}>⏰ Schedule Your Order</h2>
        <p style={{ margin:0, color:"rgba(255,255,255,0.8)", fontSize:12 }}>Order now, receive it when you want</p>
      </div>
      <div style={{ padding:"20px 18px" }}>
        <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:15 }}>Order Type</p>
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {[{id:"delivery",icon:"🛵",label:"Delivery"},{id:"pickup",icon:"🏃",label:"Self Pickup"}].map(t=>(
            <button key={t.id} onClick={()=>setType(t.id)} style={{ flex:1, background:type===t.id?C.cream:C.white, border:`2px solid ${type===t.id?C.accent:C.border}`, borderRadius:14, padding:14, cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <span style={{ fontWeight:900, color:type===t.id?C.accent:C.text, fontSize:14 }}>{t.label}</span>
            </button>
          ))}
        </div>
        <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:15 }}>Pick a Day</p>
        <div style={{ display:"flex", gap:10, marginBottom:20 }}>
          {days.map((d,i)=>(
            <button key={i} onClick={()=>setDay(i)} style={{ flex:1, background:day===i?C.accent:C.white, border:`2px solid ${day===i?C.accent:C.border}`, borderRadius:14, padding:"12px 8px", cursor:"pointer", textAlign:"center" }}>
              <p style={{ margin:0, fontWeight:900, color:day===i?"#fff":C.text, fontSize:13 }}>{d.label}</p>
            </button>
          ))}
        </div>
        <p style={{ margin:"0 0 10px", fontWeight:900, color:C.text, fontSize:15 }}>Pick a Time</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {slots.map(s=>(
            <button key={s} onClick={()=>setSlot(s)} style={{ background:slot===s?C.accent:C.cream, border:`1.5px solid ${slot===s?C.accent:C.border}`, borderRadius:10, padding:"9px 14px", color:slot===s?"#fff":C.sub, fontSize:12, fontWeight:800, cursor:"pointer" }}>{s}</button>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{ background:C.cream, border:`1.5px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:16 }}>
            <p style={{ margin:"0 0 6px", fontWeight:800, color:C.sub, fontSize:11, letterSpacing:1.5, textTransform:"uppercase" }}>Order Summary</p>
            <p style={{ margin:0, color:C.text, fontSize:13 }}>{cart.map(i=>`${i.qty}× ${i.name}`).join(", ")}</p>
          </div>
        )}
        <button onClick={()=>{ if(slot) setDone(true); }} disabled={!slot} style={{ width:"100%", background:slot?"linear-gradient(135deg,#C0290A,#E63939)":"#EAE0D5", border:"none", borderRadius:14, padding:"16px 0", color:"#fff", fontSize:14, fontWeight:900, cursor:slot?"pointer":"not-allowed" }}>
          ⏰ Schedule for {days[day].label} at {slot||"—"}
        </button>
      </div>
    </div>
  );
}

/* ─── NEW: SMART REORDER CARD (inline component for home screen) ────────── */
function SmartReorderCard({ setCart }) {
  const last = ORDER_HISTORY[0];
  const [added, setAdded] = useState(false);
  const reorder = () => {
    last.items.forEach(name => {
      const item = MENU.find(m=>m.name===name);
      if(item) setCart(c=>{ const ex=c.find(x=>x.id===item.id); return ex?c.map(x=>x.id===item.id?{...x,qty:x.qty+1}:x):[...c,{...item,qty:1}]; });
    });
    setAdded(true);
    setTimeout(()=>setAdded(false),3000);
  };
  return (
    <div style={{ margin:"14px 18px 0", background:C.white, border:`1.5px solid ${C.border}`, borderRadius:20, padding:"14px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ flex:1 }}>
          <p style={{ margin:"0 0 3px", fontSize:10, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Your Usual 🔄</p>
          <p style={{ margin:"0 0 6px", fontWeight:900, color:C.text, fontSize:14 }}>{last.items.slice(0,2).join(", ")}{last.items.length>2?` +${last.items.length-2} more`:""}</p>
          <p style={{ margin:0, color:C.sub, fontSize:11 }}>{fmt(last.total)} · Last ordered {new Date(last.date).toLocaleDateString("en-NG",{day:"numeric",month:"short"})}</p>
        </div>
        <button onClick={reorder} style={{ background:added?C.green:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:12, padding:"10px 16px", color:"#fff", fontSize:12, fontWeight:900, cursor:"pointer", flexShrink:0, transition:"all 0.3s" }}>
          {added?"✓ Added!":"Reorder"}
        </button>
      </div>
    </div>
  );
}

/* ─── LOGIN SCREEN ───────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [tab, setTab]         = useState("login"); // "login" | "signup"
  const [phone, setPhone]     = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = () => {
    onLogin(name || "Adaeze");
  };

  return (
    <div style={{ minHeight:"100vh", background:"#FAF7F0", display:"flex", flexDirection:"column" }}>
      {/* Top hero */}
      <div style={{ background:`linear-gradient(160deg,#7A0A00,#B01E0A,#E63939)`, padding:"52px 28px 40px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-60, top:-60, width:200, height:200, borderRadius:"50%", background:`${C.accent}22` }}/>
        <div style={{ position:"absolute", left:-40, bottom:-40, width:150, height:150, borderRadius:"50%", background:`${C.accent2}18` }}/>
        <div style={{ width:70, height:70, borderRadius:22, background:`linear-gradient(135deg,#C0290A,#E63939)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:38, margin:"0 auto 16px", boxShadow:`0 8px 28px ${C.accent}55` }}>🍽</div>
        <h1 style={{ margin:"0 0 6px", color:"#fff", fontSize:30, fontWeight:900, letterSpacing:0.3 }}>Tasty Fingers</h1>
        <p style={{ margin:0, color:"rgba(255,255,255,0.6)", fontSize:13 }}>Jos · Abuja — Real Nigerian Food 🇳🇬</p>
      </div>

      {/* Form card */}
      <div style={{ flex:1, background:"#FAF7F0", borderRadius:"28px 28px 0 0", marginTop:-20, padding:"28px 24px 40px" }}>
        {/* Tab switcher */}
        <div style={{ display:"flex", background:C.cream, borderRadius:14, padding:4, marginBottom:24 }}>
          {["login","signup"].map(t=>(
            <button key={t} onClick={()=>{setTab(t);setError("");}} style={{ flex:1, background:tab===t?C.white:"none", border:"none", borderRadius:11, padding:"11px 0", fontWeight:900, fontSize:13, color:tab===t?C.text:C.sub, cursor:"pointer", boxShadow:tab===t?"0 2px 8px rgba(0,0,0,0.08)":"none", transition:"all 0.2s", textTransform:"capitalize" }}>
              {t==="login"?"Sign In":"Create Account"}
            </button>
          ))}
        </div>

        {tab==="signup"&&(
          <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"13px 16px", marginBottom:12 }}>
            <p style={{ margin:"0 0 4px", fontSize:9, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Full Name</p>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Chioma Okonkwo" style={{ background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700, width:"100%" }}/>
          </div>
        )}

        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"13px 16px", marginBottom:12 }}>
          <p style={{ margin:"0 0 4px", fontSize:9, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Phone Number</p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:C.sub, fontSize:14, fontWeight:700 }}>🇳🇬 +234</span>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="800 000 0000" type="tel" style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700 }}/>
          </div>
        </div>

        <div style={{ background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"13px 16px", marginBottom:20 }}>
          <p style={{ margin:"0 0 4px", fontSize:9, fontWeight:800, color:C.sub, letterSpacing:1.5, textTransform:"uppercase" }}>Password</p>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password" type={showPass?"text":"password"} style={{ flex:1, background:"none", border:"none", outline:"none", color:C.text, fontSize:15, fontWeight:700 }}/>
            <button onClick={()=>setShowPass(s=>!s)} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, fontSize:16, padding:0 }}>{showPass?"🙈":"👁"}</button>
          </div>
        </div>

        {tab==="login"&&(
          <p style={{ margin:"0 0 18px", textAlign:"right", fontSize:12, color:C.accent, fontWeight:800, cursor:"pointer" }}>Forgot Password?</p>
        )}

        <button onClick={handleSubmit} style={{ width:"100%", background:`linear-gradient(135deg,#C0290A,#E63939)`, border:"none", borderRadius:16, padding:"18px 0", color:"#fff", fontSize:15, fontWeight:900, cursor:"pointer", boxShadow:"0 8px 24px #E6393944", marginBottom:16 }}>
          {tab==="login" ? "Sign In →" : "Create Account →"}
        </button>

        {/* Social divider */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:C.border }}/>
          <span style={{ color:C.sub, fontSize:11, fontWeight:700 }}>or continue with</span>
          <div style={{ flex:1, height:1, background:C.border }}/>
        </div>

        <div style={{ display:"flex", gap:10, marginBottom:28 }}>
          {[{icon:"🇬", label:"Google"},{icon:"📞", label:"Phone OTP"}].map(s=>(
            <button key={s.label} onClick={()=>onLogin("Guest")} style={{ flex:1, background:C.white, border:`1.5px solid ${C.border}`, borderRadius:14, padding:"13px 0", fontSize:13, fontWeight:800, color:C.text, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ fontSize:18 }}>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>

        <p style={{ textAlign:"center", color:C.sub, fontSize:11, lineHeight:1.8 }}>
          By continuing you agree to our <span style={{ color:C.accent, fontWeight:800 }}>Terms</span> & <span style={{ color:C.accent, fontWeight:800 }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

/* ─── HARDCODED API KEY PLACEHOLDER ─────────────────────────────────────── */
// Replace the string below with your real API key before shipping
const APP_API_KEY = "YOUR_API_KEY_HERE";

export default function TastyFingersApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [screen, setScreen]     = useState("home");
  const [cart, setCart]         = useState([]);
  const go = (s) => setScreen(s);
  const navScreens = ["home","menu","dashboard","reserve","profile"];

  if(!loggedIn) return <LoginScreen onLogin={(n)=>{ setUserName(n); setLoggedIn(true); }}/>;

  const render = () => {
    switch(screen) {
      case "home":      return <HomeScreen      go={go} cart={cart} setCart={setCart}/>;
      case "menu":      return <MenuScreen      cart={cart} setCart={setCart}/>;
      case "cart":      return <CartScreen      cart={cart} setCart={setCart} go={go}/>;
      case "orders":    return <OrdersScreen    go={go}/>;
      case "reserve":   return <ReserveScreen   />;
      case "profile":   return <ProfileScreen   go={go}/>;
      case "dashboard": return <DashboardScreen go={go}/>;
      case "aichat":    return <AIChatScreen    go={go} setCart={setCart}/>;
      case "flash":     return <FlashScreen     cart={cart} setCart={setCart} go={go}/>;
      case "group":     return <GroupOrderScreen go={go}/>;
      case "catering":  return <CateringScreen  go={go}/>;
      case "ai":        return <AIComboScreen   go={go} setCart={setCart}/>;
      case "gallery":   return <GalleryScreen   go={go}/>;
      case "queue":     return <QueueScreen     go={go}/>;
      case "mealplan":  return <MealPlanScreen  go={go}/>;
      case "split":     return <SplitBillScreen go={go} cart={cart}/>;
      case "birthday":  return <BirthdayScreen  go={go}/>;
      case "tracker":   return <LiveTrackerScreen go={go}/>;
      case "streak":    return <StreakScreen     go={go}/>;
      case "dinein":    return <DineInScreen     go={go} cart={cart} setCart={setCart}/>;
      case "schedule":  return <ScheduleScreen   go={go} cart={cart}/>;
      case "voice":     return <VoiceOrderScreen  go={go} setCart={setCart}/>;
      case "mood":      return <MoodOrderScreen   go={go} setCart={setCart}/>;
      case "tasteDNA":  return <TasteDNAScreen    go={go}/>;
      case "notifications": return <NotificationsScreen go={go}/>;
      case "social":    return <SocialFeedScreen  go={go} setCart={setCart}/>;
      case "specials":  return <WeeklySpecialsScreen go={go} setCart={setCart}/>;
      case "gift":      return <GiftMealScreen    go={go}/>;
      case "corp":      return <CorporateScreen   go={go}/>;
      default:          return <HomeScreen      go={go} cart={cart} setCart={setCart}/>;
    }
  };

  return (
    <ApiKeyCtx.Provider value={{ apiKey: APP_API_KEY, setApiKey:()=>{} }}>
      <div style={{ display:"flex", justifyContent:"center", background:"#EDE4D8", minHeight:"100vh", padding:"16px 0" }}>
        <div style={{ width:420, background:"#FAF7F0", minHeight:"100vh", position:"relative", overflow:"hidden", fontFamily:"'DM Sans', system-ui, sans-serif", boxShadow:"0 0 60px rgba(0,0,0,0.18)" }}>
          {render()}
          {navScreens.includes(screen) && <BottomNav active={screen} go={go}/>}
          {screen==="home" && cart.length>0 && (
            <button onClick={()=>go("cart")} style={{ position:"fixed", bottom:90, right:"calc(50% - 210px + 14px)", background:`linear-gradient(135deg,#C0290A,#E63939)`, color:"#fff", border:"none", borderRadius:14, padding:"12px 16px", fontSize:12, fontWeight:900, cursor:"pointer", boxShadow:"0 8px 24px #E639394455", display:"flex", alignItems:"center", gap:8, zIndex:90 }}>
              🛒 {cart.reduce((a,i)=>a+i.qty,0)} · {fmt(cart.reduce((a,i)=>a+i.price*i.qty,0))}
            </button>
          )}
        </div>
      </div>
    </ApiKeyCtx.Provider>
  );
}
