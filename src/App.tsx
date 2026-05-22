import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ModeProvider } from "@/contexts/ModeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";
import CartDrawer from "@/components/CartDrawer";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ReviewsPage from "./pages/ReviewsPage";
import ContactPage from "./pages/ContactPage";
import SurveysPage from "./pages/SurveysPage";
import ShopPage from "./pages/ShopPage";
import DashboardPage from "./pages/DashboardPage";
import ImpressumPage from "./pages/ImpressumPage";
import DatenschutzPage from "./pages/DatenschutzPage";
import AGBPage from "./pages/AGBPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ModeProvider>
        <LanguageProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/surveys" element={<SurveysPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/impressum" element={<ImpressumPage />} />
                  <Route path="/datenschutz" element={<DatenschutzPage />} />
                  <Route path="/agb" element={<AGBPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
              <CartDrawer />
            </BrowserRouter>
          </CartProvider>
        </LanguageProvider>
      </ModeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
