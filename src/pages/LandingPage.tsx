import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { selectAuth } from '../redux/slices/authSlice';
import { Menu, X, PackageOpen, BarChart3, Users, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <PackageOpen className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">Gestion Stock</span>
            </div>
            
            {/* Navigation Bureau */}
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition">
                Fonctionnalités
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 transition">
                Comment ça marche
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-primary-600 transition">
                Témoignages
              </a>
            </nav>
            
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium transition"
              >
                Connexion
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                Commencer
              </Link>
            </div>
            
            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t mt-2 animate-fade-in">
            <div className="container mx-auto px-4 pt-2 pb-4 space-y-3">
              <a
                href="#features"
                className="block py-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#how-it-works"
                className="block py-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a
                href="#testimonials"
                className="block py-2 text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Témoignages
              </a>
              <div className="pt-4 flex flex-col space-y-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-center text-primary-600 border border-primary-600 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-center bg-primary-600 text-white rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Commencer
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Section Héro */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Gestion de Stock Efficace pour Votre Entreprise
              </h1>
              <p className="mt-4 text-xl text-gray-600 max-w-md">
                Optimisez vos processus d'inventaire avec notre système de gestion de stock puissant. Suivez, gérez et optimisez votre inventaire en toute simplicité.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg text-center hover:bg-primary-700 transition shadow-md"
                >
                  Commencer
                </Link>
                <a
                  href="#features"
                  className="px-6 py-3 bg-white text-primary-600 rounded-lg text-center hover:bg-gray-50 transition border border-gray-200 shadow-sm"
                >
                  En savoir plus
                </a>
              </div>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <img
               
               
              //  src='https://www.mon-erp-industriel.fr/blog/gestion-stocks-erp-wms/
              // '
               // src="https://images.pexels.com/photos/7654586/pexels-photo-7654586.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                
               src="https://www.mon-erp-industriel.fr/wp-content/uploads/elementor/thumbs/Stocks-ERP-WMS-plwkv2tl3t55hhkfivgtacalaua595u78vs2s8rhvk.png"
               alt="Tableau de bord de gestion d'inventaire"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Fonctionnalités</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Notre système de gestion de stock offre tout ce dont vous avez besoin pour gérer efficacement votre inventaire
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fonctionnalité 1 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-primary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <PackageOpen className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Suivi d'Inventaire</h3>
              <p className="mt-4 text-gray-600">
                Suivez les niveaux de stock en temps réel avec des notifications automatiques lorsque l'inventaire atteint des seuils critiques.
              </p>
            </div>
            
            {/* Fonctionnalité 2 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-secondary-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-7 w-7 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Analyses & Rapports</h3>
              <p className="mt-4 text-gray-600">
                Générez des rapports détaillés sur la performance de l'inventaire, la rotation des stocks et les tendances de consommation.
              </p>
            </div>
            
            {/* Fonctionnalité 3 */}
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="bg-accent-100 w-14 h-14 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Accès par Rôle</h3>
              <p className="mt-4 text-gray-600">
                Attribuez des permissions spécifiques aux employés, gestionnaires et fournisseurs pour plus de sécurité et d'efficacité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Comment ça marche</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Commencez avec StockPro en quelques étapes simples
            </p>
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto">
            {/* Étape 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  1
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-900">Inscription & Configuration</h3>
                <p className="mt-2 text-gray-600">
                  Créez votre compte et configurez votre profil d'entreprise avec les départements, emplacements et rôles utilisateurs.
                </p>
              </div>
            </div>
            
            {/* Étape 2 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  2
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-900">Importation de l'Inventaire</h3>
                <p className="mt-2 text-gray-600">
                  Ajoutez vos articles existants manuellement ou importez-les en masse à l'aide de nos modèles.
                </p>
              </div>
            </div>
            
            {/* Étape 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-white text-2xl font-bold">
                  3
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-semibold text-gray-900">Gestion & Optimisation</h3>
                <p className="mt-2 text-gray-600">
                  Commencez à suivre vos mouvements de stock, générez des rapports et prenez des décisions éclairées pour optimiser votre inventaire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <PackageOpen className="h-8 w-8 text-primary-500" />
                <span className="ml-2 text-2xl font-bold">StockPro</span>
              </div>
              <p className="mt-4 text-gray-400">
                Gestion d'inventaire efficace pour entreprises de toutes tailles.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">À propos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Carrières</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Centre d'aide</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Nous contacter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Politique de confidentialité</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Commencer</h3>
              <Link
                to="/login"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg inline-block hover:bg-primary-700 transition"
              >
                S'inscrire maintenant
              </Link>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} StockPro. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;