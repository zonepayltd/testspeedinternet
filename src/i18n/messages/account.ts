import type { Locale } from "../config";

// Visitor accounts: sign up / sign in / dashboard / compare. {name}, {n} etc. are placeholders.
const en = {
  nav: { signIn: "Sign in", createAccount: "Create account", account: "My account", dashboard: "Dashboard", myTests: "My tests", compare: "Compare", providers: "My providers", reviews: "My reviews", settings: "Settings", signOut: "Sign out" },
  meta: { login: "Sign in", signup: "Create your free account", forgot: "Forgot password", reset: "Choose a new password", verify: "Confirm your email", dashboard: "My dashboard", desc: "Your TestSpeedInternet account: saved speed tests, provider comparisons and reviews." },
  fields: {
    name: "Full name", namePh: "e.g. Sara Benali", email: "Email address", emailPh: "you@example.com", phone: "Phone number", phonePh: "Phone number",
    country: "Country", countryAuto: "Detected automatically — change it if needed", password: "Password", passwordPh: "At least 8 characters", newPassword: "New password",
    currentPassword: "Current password", show: "Show password", hide: "Hide password", searchCountry: "Search country or code", noCountries: "No countries found", selectCountry: "Select country",
    terms: "I agree to the [Terms of use](/terms) and the [Privacy policy](/privacy).", marketing: "Send me occasional tips and product news (you can unsubscribe anytime).", language: "Email language",
  },
  strength: { label: "Password strength", weak: "Weak", fair: "Fair", good: "Good", strong: "Strong" },
  errors: {
    generic: "Something went wrong. Please try again.", network: "Network error — check your connection and try again.", name: "Please enter your full name.", email: "Please enter a valid email address.",
    phone: "Please enter a valid phone number.", country: "Please choose your country.", short: "Use at least 8 characters.", weak: "Use letters and at least one number.", terms: "Please accept the terms to continue.",
    captcha: "Please complete the human check.", captchaFailed: "The human check expired. Please do it again.", emailTaken: "An account with this email already exists. Try signing in.",
    badLogin: "Wrong email or password.", tooMany: "Too many attempts. Please wait a few minutes and try again.", disabled: "This account has been disabled. Contact support.",
    wrongPassword: "Your current password is not correct.", tokenInvalid: "This link is invalid or has expired.", notConfigured: "Accounts are temporarily unavailable.",
    unverified: "Please confirm your email address first.",
    mailFailed: "We couldn't send the email right now. Please try again later or contact support@testspeedinternet.com.",
  },
  login: { title: "Welcome back", subtitle: "Sign in to see your saved tests and compare providers.", submit: "Sign in", forgot: "Forgot password?", noAccount: "New to TestSpeedInternet?", create: "Create a free account" },
  signup: {
    title: "Create your free account", subtitle: "Save every speed test, compare providers and share reviews with other customers.", submit: "Create account", have: "Already have an account?", signIn: "Sign in",
    benefits: ["Keep the history of all your speed tests", "Compare two tests or two internet providers side by side", "Rate your provider and read other customers' reviews", "Free forever — no ads in your dashboard"],
    claim: "Your latest test result will be saved to your new account.", doneTitle: "Account created!", doneText: "We sent a confirmation link to {email}. Click it to confirm your email address.", mailFailed: "Your account works, but we couldn't send the confirmation email right now. You can resend it from your dashboard.", go: "Go to my dashboard",
  },
  forgot: { title: "Forgot your password?", subtitle: "Enter your email and we'll send you a link to choose a new password.", submit: "Send reset link", sentTitle: "Check your inbox", sent: "If an account exists for {email}, a reset link is on its way. It expires in 1 hour.", back: "Back to sign in" },
  reset: { title: "Choose a new password", subtitle: "Pick a strong password you don't use anywhere else.", submit: "Save new password", invalid: "This reset link is invalid or has expired.", again: "Request a new link" },
  verify: { okTitle: "Email confirmed", okText: "Thanks! Your email address is confirmed. Your account is fully active.", badTitle: "Link expired", badText: "This confirmation link is invalid, already used or expired. Sign in and request a new one from your dashboard.", dashboard: "Open my dashboard", signIn: "Sign in" },
  dash: {
    hello: "Hi {name} 👋", subtitle: "Your speed tests, comparisons and reviews in one place.", runTest: "Run a new test",
    tabs: { overview: "Overview", tests: "My tests", compare: "Compare", providers: "Providers", reviews: "My reviews", settings: "Settings" },
    verifyBanner: "Please confirm your email address ({email}). Reviews you write are published once your email is confirmed.", resend: "Resend email", resent: "Confirmation email sent.",
    gateTitle: "Confirm your email to open your dashboard", gateText: "We sent a confirmation link to {email}. Click it to activate your account — then your saved tests, comparisons and reviews unlock.", gateRefresh: "I've confirmed my email", gateNotYet: "Not confirmed yet — open the link in the email first.", gateSpam: "Can't find it? Check your spam or promotions folder, or send a new link.", gateOther: "Use another account",
    stats: { tests: "Tests run", avgDown: "Avg. download", avgUp: "Avg. upload", avgPing: "Avg. ping", bestDown: "Best download" },
    chartTitle: "Your speed over time", chartEmpty: "Run a couple of tests to see your speed trend.", emptyTitle: "No tests yet", emptyText: "Run a speed test while signed in and it's saved here automatically.", loading: "Loading…",
    latest: "Latest tests", viewAll: "View all",
  },
  tests: {
    date: "Date", provider: "Provider", server: "Server", mode: "Type", down: "Download", up: "Upload", ping: "Ping", actions: "Actions", remove: "Remove from history", removeConfirm: "Remove this test from your history?",
    compareSel: "Compare selected", selectHint: "Select two tests to compare them.", unknown: "Unknown provider", modes: { full: "Full test", download: "Download", upload: "Upload", ping: "Ping" }, count: "{n} tests",
  },
  compare: {
    title: "Compare two tests", subtitle: "Pick any two tests — for example your home and office connections, or two different providers.", a: "Test A", b: "Test B", choose: "Choose a test",
    needTwo: "You need at least two saved tests to compare.", winner: "Better", tie: "Same", faster: "{p}% faster", lower: "{p}% lower", metric: "Metric", overall: "Overall winner", draw: "It's a draw",
    ratings: { excellent: "Excellent", good: "Good", fair: "Fair", slow: "Slow" },
  },
  providers: { title: "Your providers", subtitle: "Averages from your own tests, plus the community rating.", tests: "tests", best: "Best", community: "Community rating", reviewsN: "{n} reviews", noReviews: "No reviews yet", see: "See reviews", empty: "Your providers appear here after your first test." },
  reviews: { title: "My reviews", empty: "You haven't reviewed a provider yet. Run a test and rate your provider.", status: { pending: "Waiting for email confirmation", published: "Published", hidden: "Hidden by moderator" }, delete: "Delete review", deleteConfirm: "Delete this review permanently?", view: "View" },
  settings: {
    profile: "Profile", profileText: "Your name is shown on reviews as first name + initial.", save: "Save changes", saved: "Saved.", email: "Email", verified: "Confirmed", notVerified: "Not confirmed",
    password: "Password", passwordText: "Changing your password signs you out on other devices.", change: "Change password", changed: "Password changed.",
    data: "Your data", dataText: "Download a copy of your profile, tests and reviews (JSON).", export: "Export my data",
    danger: "Delete account", dangerText: "Permanently deletes your account and reviews. Your tests are anonymised. This can't be undone.", delete: "Delete my account", deleteConfirm: "Enter your password to confirm", deleted: "Your account has been deleted.", cancel: "Cancel",
    memberSince: "Member since {date}",
  },
  prompt: {
    title: "Save this result & compare providers", text: "Create a free account to keep your test history, compare two connections and get the most from your internet.",
    benefits: ["Test history & speed charts", "Compare 2 tests or providers", "Review your provider"], create: "Create free account", signIn: "Sign in", dismiss: "Dismiss",
    savedTitle: "Saved to your dashboard", savedText: "This test is in your history. Compare it with another test or provider.", viewTests: "My tests", compare: "Compare",
  },
};

export type AccountMessages = typeof en;

const fr: AccountMessages = {
  nav: { signIn: "Connexion", createAccount: "Créer un compte", account: "Mon compte", dashboard: "Tableau de bord", myTests: "Mes tests", compare: "Comparer", providers: "Mes fournisseurs", reviews: "Mes avis", settings: "Paramètres", signOut: "Déconnexion" },
  meta: { login: "Connexion", signup: "Créez votre compte gratuit", forgot: "Mot de passe oublié", reset: "Nouveau mot de passe", verify: "Confirmez votre e-mail", dashboard: "Mon tableau de bord", desc: "Votre compte TestSpeedInternet : tests enregistrés, comparaisons de fournisseurs et avis." },
  fields: {
    name: "Nom complet", namePh: "ex. Sara Benali", email: "Adresse e-mail", emailPh: "vous@exemple.com", phone: "Numéro de téléphone", phonePh: "Numéro de téléphone",
    country: "Pays", countryAuto: "Détecté automatiquement — modifiez-le si besoin", password: "Mot de passe", passwordPh: "Au moins 8 caractères", newPassword: "Nouveau mot de passe",
    currentPassword: "Mot de passe actuel", show: "Afficher le mot de passe", hide: "Masquer le mot de passe", searchCountry: "Rechercher un pays ou un indicatif", noCountries: "Aucun pays trouvé", selectCountry: "Choisir le pays",
    terms: "J'accepte les [Conditions d'utilisation](/terms) et la [Politique de confidentialité](/privacy).", marketing: "Recevoir de temps en temps des conseils et nouveautés (désinscription à tout moment).", language: "Langue des e-mails",
  },
  strength: { label: "Robustesse du mot de passe", weak: "Faible", fair: "Moyen", good: "Bon", strong: "Fort" },
  errors: {
    generic: "Une erreur s'est produite. Veuillez réessayer.", network: "Erreur réseau — vérifiez votre connexion et réessayez.", name: "Veuillez saisir votre nom complet.", email: "Veuillez saisir une adresse e-mail valide.",
    phone: "Veuillez saisir un numéro de téléphone valide.", country: "Veuillez choisir votre pays.", short: "Utilisez au moins 8 caractères.", weak: "Utilisez des lettres et au moins un chiffre.", terms: "Veuillez accepter les conditions pour continuer.",
    captcha: "Veuillez compléter la vérification.", captchaFailed: "La vérification a expiré. Recommencez-la.", emailTaken: "Un compte existe déjà avec cet e-mail. Essayez de vous connecter.",
    badLogin: "E-mail ou mot de passe incorrect.", tooMany: "Trop de tentatives. Patientez quelques minutes puis réessayez.", disabled: "Ce compte a été désactivé. Contactez le support.",
    wrongPassword: "Votre mot de passe actuel est incorrect.", tokenInvalid: "Ce lien est invalide ou a expiré.", notConfigured: "Les comptes sont temporairement indisponibles.",
    unverified: "Veuillez d'abord confirmer votre adresse e-mail.",
    mailFailed: "Impossible d'envoyer l'e-mail pour le moment. Réessayez plus tard ou écrivez à support@testspeedinternet.com.",
  },
  login: { title: "Bon retour", subtitle: "Connectez-vous pour retrouver vos tests et comparer les fournisseurs.", submit: "Se connecter", forgot: "Mot de passe oublié ?", noAccount: "Nouveau sur TestSpeedInternet ?", create: "Créer un compte gratuit" },
  signup: {
    title: "Créez votre compte gratuit", subtitle: "Enregistrez chaque test, comparez les fournisseurs et partagez vos avis avec d'autres clients.", submit: "Créer mon compte", have: "Vous avez déjà un compte ?", signIn: "Se connecter",
    benefits: ["Gardez l'historique de tous vos tests de débit", "Comparez deux tests ou deux fournisseurs côte à côte", "Notez votre fournisseur et lisez les avis des clients", "Gratuit pour toujours — sans pub dans votre espace"],
    claim: "Votre dernier résultat sera enregistré dans votre nouveau compte.", doneTitle: "Compte créé !", doneText: "Nous avons envoyé un lien de confirmation à {email}. Cliquez dessus pour confirmer votre adresse.", mailFailed: "Votre compte fonctionne, mais l'e-mail de confirmation n'a pas pu être envoyé. Vous pourrez le renvoyer depuis votre tableau de bord.", go: "Aller au tableau de bord",
  },
  forgot: { title: "Mot de passe oublié ?", subtitle: "Saisissez votre e-mail, nous vous enverrons un lien pour choisir un nouveau mot de passe.", submit: "Envoyer le lien", sentTitle: "Vérifiez votre boîte mail", sent: "Si un compte existe pour {email}, un lien de réinitialisation arrive. Il expire dans 1 heure.", back: "Retour à la connexion" },
  reset: { title: "Choisissez un nouveau mot de passe", subtitle: "Choisissez un mot de passe solide que vous n'utilisez nulle part ailleurs.", submit: "Enregistrer", invalid: "Ce lien de réinitialisation est invalide ou a expiré.", again: "Demander un nouveau lien" },
  verify: { okTitle: "E-mail confirmé", okText: "Merci ! Votre adresse e-mail est confirmée. Votre compte est entièrement actif.", badTitle: "Lien expiré", badText: "Ce lien de confirmation est invalide, déjà utilisé ou expiré. Connectez-vous et demandez-en un nouveau depuis votre tableau de bord.", dashboard: "Ouvrir mon tableau de bord", signIn: "Se connecter" },
  dash: {
    hello: "Bonjour {name} 👋", subtitle: "Vos tests, comparaisons et avis au même endroit.", runTest: "Lancer un test",
    tabs: { overview: "Vue d'ensemble", tests: "Mes tests", compare: "Comparer", providers: "Fournisseurs", reviews: "Mes avis", settings: "Paramètres" },
    verifyBanner: "Confirmez votre adresse e-mail ({email}). Vos avis sont publiés une fois l'e-mail confirmé.", resend: "Renvoyer l'e-mail", resent: "E-mail de confirmation envoyé.",
    gateTitle: "Confirmez votre e-mail pour ouvrir votre tableau de bord", gateText: "Nous avons envoyé un lien de confirmation à {email}. Cliquez dessus pour activer votre compte : vos tests, comparaisons et avis seront alors accessibles.", gateRefresh: "J'ai confirmé mon e-mail", gateNotYet: "Pas encore confirmé : ouvrez d'abord le lien reçu par e-mail.", gateSpam: "Vous ne le trouvez pas ? Vérifiez vos spams ou demandez un nouveau lien.", gateOther: "Utiliser un autre compte",
    stats: { tests: "Tests effectués", avgDown: "Descendant moyen", avgUp: "Montant moyen", avgPing: "Ping moyen", bestDown: "Meilleur descendant" },
    chartTitle: "Votre débit dans le temps", chartEmpty: "Faites quelques tests pour voir l'évolution de votre débit.", emptyTitle: "Aucun test pour l'instant", emptyText: "Lancez un test en étant connecté : il sera enregistré ici automatiquement.", loading: "Chargement…",
    latest: "Derniers tests", viewAll: "Tout voir",
  },
  tests: {
    date: "Date", provider: "Fournisseur", server: "Serveur", mode: "Type", down: "Descendant", up: "Montant", ping: "Ping", actions: "Actions", remove: "Retirer de l'historique", removeConfirm: "Retirer ce test de votre historique ?",
    compareSel: "Comparer la sélection", selectHint: "Sélectionnez deux tests pour les comparer.", unknown: "Fournisseur inconnu", modes: { full: "Test complet", download: "Descendant", upload: "Montant", ping: "Ping" }, count: "{n} tests",
  },
  compare: {
    title: "Comparer deux tests", subtitle: "Choisissez deux tests — par exemple la maison et le bureau, ou deux fournisseurs différents.", a: "Test A", b: "Test B", choose: "Choisir un test",
    needTwo: "Il vous faut au moins deux tests enregistrés pour comparer.", winner: "Meilleur", tie: "Égalité", faster: "{p} % plus rapide", lower: "{p} % plus bas", metric: "Mesure", overall: "Grand gagnant", draw: "Match nul",
    ratings: { excellent: "Excellent", good: "Bon", fair: "Correct", slow: "Lent" },
  },
  providers: { title: "Vos fournisseurs", subtitle: "Moyennes de vos propres tests et note de la communauté.", tests: "tests", best: "Meilleur", community: "Note de la communauté", reviewsN: "{n} avis", noReviews: "Pas encore d'avis", see: "Voir les avis", empty: "Vos fournisseurs apparaissent ici après votre premier test." },
  reviews: { title: "Mes avis", empty: "Vous n'avez encore noté aucun fournisseur. Faites un test et notez votre fournisseur.", status: { pending: "En attente de confirmation de l'e-mail", published: "Publié", hidden: "Masqué par la modération" }, delete: "Supprimer l'avis", deleteConfirm: "Supprimer définitivement cet avis ?", view: "Voir" },
  settings: {
    profile: "Profil", profileText: "Sur les avis, votre nom s'affiche sous la forme prénom + initiale.", save: "Enregistrer", saved: "Enregistré.", email: "E-mail", verified: "Confirmé", notVerified: "Non confirmé",
    password: "Mot de passe", passwordText: "Changer de mot de passe vous déconnecte des autres appareils.", change: "Changer le mot de passe", changed: "Mot de passe modifié.",
    data: "Vos données", dataText: "Téléchargez une copie de votre profil, de vos tests et de vos avis (JSON).", export: "Exporter mes données",
    danger: "Supprimer le compte", dangerText: "Supprime définitivement votre compte et vos avis. Vos tests sont anonymisés. Action irréversible.", delete: "Supprimer mon compte", deleteConfirm: "Saisissez votre mot de passe pour confirmer", deleted: "Votre compte a été supprimé.", cancel: "Annuler",
    memberSince: "Membre depuis le {date}",
  },
  prompt: {
    title: "Enregistrez ce résultat et comparez les fournisseurs", text: "Créez un compte gratuit pour garder l'historique de vos tests, comparer deux connexions et tirer le meilleur de votre internet.",
    benefits: ["Historique et graphiques", "Comparer 2 tests ou fournisseurs", "Noter votre fournisseur"], create: "Créer un compte gratuit", signIn: "Se connecter", dismiss: "Fermer",
    savedTitle: "Enregistré dans votre espace", savedText: "Ce test est dans votre historique. Comparez-le avec un autre test ou fournisseur.", viewTests: "Mes tests", compare: "Comparer",
  },
};

const es: AccountMessages = {
  nav: { signIn: "Iniciar sesión", createAccount: "Crear cuenta", account: "Mi cuenta", dashboard: "Panel", myTests: "Mis tests", compare: "Comparar", providers: "Mis proveedores", reviews: "Mis reseñas", settings: "Ajustes", signOut: "Cerrar sesión" },
  meta: { login: "Iniciar sesión", signup: "Crea tu cuenta gratis", forgot: "Contraseña olvidada", reset: "Nueva contraseña", verify: "Confirma tu correo", dashboard: "Mi panel", desc: "Tu cuenta de TestSpeedInternet: tests guardados, comparativas de proveedores y reseñas." },
  fields: {
    name: "Nombre completo", namePh: "p. ej. Sara Benali", email: "Correo electrónico", emailPh: "tu@ejemplo.com", phone: "Teléfono", phonePh: "Número de teléfono",
    country: "País", countryAuto: "Detectado automáticamente — cámbialo si hace falta", password: "Contraseña", passwordPh: "Mínimo 8 caracteres", newPassword: "Nueva contraseña",
    currentPassword: "Contraseña actual", show: "Mostrar contraseña", hide: "Ocultar contraseña", searchCountry: "Buscar país o prefijo", noCountries: "No se encontraron países", selectCountry: "Elegir país",
    terms: "Acepto los [Términos de uso](/terms) y la [Política de privacidad](/privacy).", marketing: "Envíame consejos y novedades de vez en cuando (puedes darte de baja cuando quieras).", language: "Idioma de los correos",
  },
  strength: { label: "Seguridad de la contraseña", weak: "Débil", fair: "Aceptable", good: "Buena", strong: "Fuerte" },
  errors: {
    generic: "Algo salió mal. Inténtalo de nuevo.", network: "Error de red: revisa tu conexión e inténtalo de nuevo.", name: "Introduce tu nombre completo.", email: "Introduce un correo válido.",
    phone: "Introduce un número de teléfono válido.", country: "Elige tu país.", short: "Usa al menos 8 caracteres.", weak: "Usa letras y al menos un número.", terms: "Acepta los términos para continuar.",
    captcha: "Completa la verificación humana.", captchaFailed: "La verificación caducó. Hazla de nuevo.", emailTaken: "Ya existe una cuenta con este correo. Prueba a iniciar sesión.",
    badLogin: "Correo o contraseña incorrectos.", tooMany: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.", disabled: "Esta cuenta está desactivada. Contacta con soporte.",
    wrongPassword: "Tu contraseña actual no es correcta.", tokenInvalid: "Este enlace no es válido o ha caducado.", notConfigured: "Las cuentas no están disponibles temporalmente.",
    unverified: "Primero confirma tu dirección de correo.",
    mailFailed: "No pudimos enviar el correo en este momento. Inténtalo más tarde o escribe a support@testspeedinternet.com.",
  },
  login: { title: "Hola de nuevo", subtitle: "Inicia sesión para ver tus tests guardados y comparar proveedores.", submit: "Iniciar sesión", forgot: "¿Olvidaste la contraseña?", noAccount: "¿Nuevo en TestSpeedInternet?", create: "Crea una cuenta gratis" },
  signup: {
    title: "Crea tu cuenta gratis", subtitle: "Guarda cada test, compara proveedores y comparte reseñas con otros clientes.", submit: "Crear cuenta", have: "¿Ya tienes cuenta?", signIn: "Iniciar sesión",
    benefits: ["Guarda el historial de todos tus tests", "Compara dos tests o dos proveedores lado a lado", "Valora tu proveedor y lee reseñas de otros clientes", "Gratis para siempre, sin anuncios en tu panel"],
    claim: "Tu último resultado se guardará en tu nueva cuenta.", doneTitle: "¡Cuenta creada!", doneText: "Enviamos un enlace de confirmación a {email}. Haz clic en él para confirmar tu correo.", mailFailed: "Tu cuenta funciona, pero no pudimos enviar el correo de confirmación ahora. Puedes reenviarlo desde tu panel.", go: "Ir a mi panel",
  },
  forgot: { title: "¿Olvidaste tu contraseña?", subtitle: "Introduce tu correo y te enviaremos un enlace para elegir una nueva.", submit: "Enviar enlace", sentTitle: "Revisa tu bandeja", sent: "Si existe una cuenta para {email}, recibirás un enlace. Caduca en 1 hora.", back: "Volver a iniciar sesión" },
  reset: { title: "Elige una nueva contraseña", subtitle: "Elige una contraseña segura que no uses en otros sitios.", submit: "Guardar contraseña", invalid: "Este enlace no es válido o ha caducado.", again: "Pedir un enlace nuevo" },
  verify: { okTitle: "Correo confirmado", okText: "¡Gracias! Tu correo está confirmado y tu cuenta totalmente activa.", badTitle: "Enlace caducado", badText: "Este enlace no es válido, ya se usó o ha caducado. Inicia sesión y pide uno nuevo desde tu panel.", dashboard: "Abrir mi panel", signIn: "Iniciar sesión" },
  dash: {
    hello: "Hola, {name} 👋", subtitle: "Tus tests, comparativas y reseñas en un solo lugar.", runTest: "Hacer un test",
    tabs: { overview: "Resumen", tests: "Mis tests", compare: "Comparar", providers: "Proveedores", reviews: "Mis reseñas", settings: "Ajustes" },
    verifyBanner: "Confirma tu correo ({email}). Tus reseñas se publican cuando el correo está confirmado.", resend: "Reenviar correo", resent: "Correo de confirmación enviado.",
    gateTitle: "Confirma tu correo para abrir tu panel", gateText: "Enviamos un enlace de confirmación a {email}. Haz clic en él para activar tu cuenta y desbloquear tus tests, comparaciones y reseñas.", gateRefresh: "Ya confirmé mi correo", gateNotYet: "Aún no está confirmado: abre primero el enlace del correo.", gateSpam: "¿No lo encuentras? Revisa la carpeta de spam o pide un enlace nuevo.", gateOther: "Usar otra cuenta",
    stats: { tests: "Tests hechos", avgDown: "Descarga media", avgUp: "Subida media", avgPing: "Ping medio", bestDown: "Mejor descarga" },
    chartTitle: "Tu velocidad en el tiempo", chartEmpty: "Haz un par de tests para ver la evolución de tu velocidad.", emptyTitle: "Aún no hay tests", emptyText: "Haz un test con la sesión iniciada y se guardará aquí automáticamente.", loading: "Cargando…",
    latest: "Últimos tests", viewAll: "Ver todos",
  },
  tests: {
    date: "Fecha", provider: "Proveedor", server: "Servidor", mode: "Tipo", down: "Descarga", up: "Subida", ping: "Ping", actions: "Acciones", remove: "Quitar del historial", removeConfirm: "¿Quitar este test de tu historial?",
    compareSel: "Comparar selección", selectHint: "Selecciona dos tests para compararlos.", unknown: "Proveedor desconocido", modes: { full: "Test completo", download: "Descarga", upload: "Subida", ping: "Ping" }, count: "{n} tests",
  },
  compare: {
    title: "Comparar dos tests", subtitle: "Elige dos tests: por ejemplo casa y oficina, o dos proveedores distintos.", a: "Test A", b: "Test B", choose: "Elige un test",
    needTwo: "Necesitas al menos dos tests guardados para comparar.", winner: "Mejor", tie: "Igual", faster: "{p} % más rápido", lower: "{p} % más bajo", metric: "Métrica", overall: "Ganador", draw: "Empate",
    ratings: { excellent: "Excelente", good: "Buena", fair: "Regular", slow: "Lenta" },
  },
  providers: { title: "Tus proveedores", subtitle: "Medias de tus propios tests y valoración de la comunidad.", tests: "tests", best: "Mejor", community: "Valoración de la comunidad", reviewsN: "{n} reseñas", noReviews: "Sin reseñas todavía", see: "Ver reseñas", empty: "Tus proveedores aparecerán aquí tras tu primer test." },
  reviews: { title: "Mis reseñas", empty: "Aún no has valorado ningún proveedor. Haz un test y valora el tuyo.", status: { pending: "Esperando confirmación del correo", published: "Publicada", hidden: "Oculta por moderación" }, delete: "Eliminar reseña", deleteConfirm: "¿Eliminar esta reseña para siempre?", view: "Ver" },
  settings: {
    profile: "Perfil", profileText: "En las reseñas tu nombre aparece como nombre + inicial.", save: "Guardar cambios", saved: "Guardado.", email: "Correo", verified: "Confirmado", notVerified: "Sin confirmar",
    password: "Contraseña", passwordText: "Cambiar la contraseña cierra la sesión en otros dispositivos.", change: "Cambiar contraseña", changed: "Contraseña cambiada.",
    data: "Tus datos", dataText: "Descarga una copia de tu perfil, tests y reseñas (JSON).", export: "Exportar mis datos",
    danger: "Eliminar cuenta", dangerText: "Elimina para siempre tu cuenta y reseñas. Tus tests se anonimizan. No se puede deshacer.", delete: "Eliminar mi cuenta", deleteConfirm: "Introduce tu contraseña para confirmar", deleted: "Tu cuenta ha sido eliminada.", cancel: "Cancelar",
    memberSince: "Miembro desde {date}",
  },
  prompt: {
    title: "Guarda este resultado y compara proveedores", text: "Crea una cuenta gratis para guardar tu historial, comparar dos conexiones y sacar el máximo a tu internet.",
    benefits: ["Historial y gráficos", "Compara 2 tests o proveedores", "Valora tu proveedor"], create: "Crear cuenta gratis", signIn: "Iniciar sesión", dismiss: "Cerrar",
    savedTitle: "Guardado en tu panel", savedText: "Este test está en tu historial. Compáralo con otro test o proveedor.", viewTests: "Mis tests", compare: "Comparar",
  },
};

const ar: AccountMessages = {
  nav: { signIn: "تسجيل الدخول", createAccount: "إنشاء حساب", account: "حسابي", dashboard: "لوحة التحكم", myTests: "اختباراتي", compare: "مقارنة", providers: "مزوّدي", reviews: "تقييماتي", settings: "الإعدادات", signOut: "تسجيل الخروج" },
  meta: { login: "تسجيل الدخول", signup: "أنشئ حسابك المجاني", forgot: "نسيت كلمة المرور", reset: "كلمة مرور جديدة", verify: "تأكيد البريد الإلكتروني", dashboard: "لوحة التحكم", desc: "حسابك في TestSpeedInternet: الاختبارات المحفوظة ومقارنة المزوّدين والتقييمات." },
  fields: {
    name: "الاسم الكامل", namePh: "مثال: سارة بنعلي", email: "البريد الإلكتروني", emailPh: "you@example.com", phone: "رقم الهاتف", phonePh: "رقم الهاتف",
    country: "الدولة", countryAuto: "تم اكتشافها تلقائيًا — يمكنك تغييرها", password: "كلمة المرور", passwordPh: "8 أحرف على الأقل", newPassword: "كلمة المرور الجديدة",
    currentPassword: "كلمة المرور الحالية", show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور", searchCountry: "ابحث عن دولة أو رمز", noCountries: "لا توجد نتائج", selectCountry: "اختر الدولة",
    terms: "أوافق على [شروط الاستخدام](/terms) و[سياسة الخصوصية](/privacy).", marketing: "أرسلوا لي نصائح وأخبارًا من حين لآخر (يمكن إلغاء الاشتراك في أي وقت).", language: "لغة الرسائل",
  },
  strength: { label: "قوة كلمة المرور", weak: "ضعيفة", fair: "مقبولة", good: "جيدة", strong: "قوية" },
  errors: {
    generic: "حدث خطأ ما. حاول مرة أخرى.", network: "خطأ في الشبكة — تحقق من اتصالك وحاول مجددًا.", name: "يرجى إدخال اسمك الكامل.", email: "يرجى إدخال بريد إلكتروني صالح.",
    phone: "يرجى إدخال رقم هاتف صالح.", country: "يرجى اختيار دولتك.", short: "استخدم 8 أحرف على الأقل.", weak: "استخدم أحرفًا ورقمًا واحدًا على الأقل.", terms: "يرجى قبول الشروط للمتابعة.",
    captcha: "يرجى إكمال التحقق البشري.", captchaFailed: "انتهت صلاحية التحقق. أعد المحاولة.", emailTaken: "يوجد حساب بهذا البريد بالفعل. جرّب تسجيل الدخول.",
    badLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة.", tooMany: "محاولات كثيرة. انتظر بضع دقائق ثم حاول مجددًا.", disabled: "تم تعطيل هذا الحساب. تواصل مع الدعم.",
    wrongPassword: "كلمة المرور الحالية غير صحيحة.", tokenInvalid: "هذا الرابط غير صالح أو منتهي الصلاحية.", notConfigured: "الحسابات غير متاحة مؤقتًا.",
    unverified: "يرجى تأكيد بريدك الإلكتروني أولًا.",
    mailFailed: "تعذّر إرسال الرسالة حاليًا. حاول لاحقًا أو راسلنا على support@testspeedinternet.com.",
  },
  login: { title: "مرحبًا بعودتك", subtitle: "سجّل الدخول لرؤية اختباراتك المحفوظة ومقارنة المزوّدين.", submit: "تسجيل الدخول", forgot: "نسيت كلمة المرور؟", noAccount: "جديد في TestSpeedInternet؟", create: "أنشئ حسابًا مجانيًا" },
  signup: {
    title: "أنشئ حسابك المجاني", subtitle: "احفظ كل اختبار، وقارن المزوّدين، وشارك تقييماتك مع العملاء الآخرين.", submit: "إنشاء الحساب", have: "لديك حساب بالفعل؟", signIn: "تسجيل الدخول",
    benefits: ["احتفظ بسجل جميع اختبارات السرعة", "قارن اختبارين أو مزوّدَين جنبًا إلى جنب", "قيّم مزوّدك واقرأ آراء العملاء الآخرين", "مجاني دائمًا — بلا إعلانات في لوحتك"],
    claim: "سيُحفظ آخر اختبار أجريته في حسابك الجديد.", doneTitle: "تم إنشاء الحساب!", doneText: "أرسلنا رابط تأكيد إلى {email}. اضغط عليه لتأكيد بريدك الإلكتروني.", mailFailed: "حسابك يعمل، لكن تعذّر إرسال رسالة التأكيد الآن. يمكنك إعادة إرسالها من لوحة التحكم.", go: "الذهاب إلى لوحة التحكم",
  },
  forgot: { title: "نسيت كلمة المرور؟", subtitle: "أدخل بريدك وسنرسل لك رابطًا لاختيار كلمة مرور جديدة.", submit: "إرسال الرابط", sentTitle: "تحقق من بريدك", sent: "إذا كان هناك حساب لـ {email} فسيصلك رابط إعادة التعيين. تنتهي صلاحيته خلال ساعة.", back: "العودة لتسجيل الدخول" },
  reset: { title: "اختر كلمة مرور جديدة", subtitle: "اختر كلمة مرور قوية لا تستخدمها في مكان آخر.", submit: "حفظ كلمة المرور", invalid: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية.", again: "طلب رابط جديد" },
  verify: { okTitle: "تم تأكيد البريد", okText: "شكرًا! تم تأكيد بريدك الإلكتروني وأصبح حسابك مفعّلًا بالكامل.", badTitle: "انتهت صلاحية الرابط", badText: "رابط التأكيد غير صالح أو مستخدم أو منتهي. سجّل الدخول واطلب رابطًا جديدًا من لوحة التحكم.", dashboard: "فتح لوحة التحكم", signIn: "تسجيل الدخول" },
  dash: {
    hello: "مرحبًا {name} 👋", subtitle: "اختباراتك ومقارناتك وتقييماتك في مكان واحد.", runTest: "إجراء اختبار جديد",
    tabs: { overview: "نظرة عامة", tests: "اختباراتي", compare: "مقارنة", providers: "المزوّدون", reviews: "تقييماتي", settings: "الإعدادات" },
    verifyBanner: "يرجى تأكيد بريدك الإلكتروني ({email}). تُنشر تقييماتك بعد تأكيد البريد.", resend: "إعادة إرسال", resent: "تم إرسال رسالة التأكيد.",
    gateTitle: "أكّد بريدك الإلكتروني لفتح لوحة التحكم", gateText: "أرسلنا رابط تأكيد إلى {email}. اضغط عليه لتفعيل حسابك، وبعدها تصبح اختباراتك ومقارناتك وتقييماتك متاحة.", gateRefresh: "لقد أكّدت بريدي", gateNotYet: "لم يتم التأكيد بعد، افتح الرابط في الرسالة أولًا.", gateSpam: "لم تجد الرسالة؟ تحقّق من مجلد الرسائل غير المرغوب فيها أو اطلب رابطًا جديدًا.", gateOther: "استخدام حساب آخر",
    stats: { tests: "عدد الاختبارات", avgDown: "متوسط التنزيل", avgUp: "متوسط الرفع", avgPing: "متوسط البينغ", bestDown: "أفضل تنزيل" },
    chartTitle: "سرعتك عبر الوقت", chartEmpty: "أجرِ بضعة اختبارات لرؤية تطور سرعتك.", emptyTitle: "لا توجد اختبارات بعد", emptyText: "أجرِ اختبار سرعة وأنت مسجّل الدخول وسيُحفظ هنا تلقائيًا.", loading: "جارٍ التحميل…",
    latest: "أحدث الاختبارات", viewAll: "عرض الكل",
  },
  tests: {
    date: "التاريخ", provider: "المزوّد", server: "الخادم", mode: "النوع", down: "التنزيل", up: "الرفع", ping: "البينغ", actions: "إجراءات", remove: "إزالة من السجل", removeConfirm: "إزالة هذا الاختبار من سجلك؟",
    compareSel: "مقارنة المحدد", selectHint: "اختر اختبارين لمقارنتهما.", unknown: "مزوّد غير معروف", modes: { full: "اختبار كامل", download: "تنزيل", upload: "رفع", ping: "بينغ" }, count: "{n} اختبار",
  },
  compare: {
    title: "قارن بين اختبارين", subtitle: "اختر أي اختبارين — مثل اتصال المنزل والمكتب، أو مزوّدَين مختلفين.", a: "الاختبار أ", b: "الاختبار ب", choose: "اختر اختبارًا",
    needTwo: "تحتاج إلى اختبارين محفوظين على الأقل للمقارنة.", winner: "الأفضل", tie: "متساوٍ", faster: "أسرع بنسبة {p}%", lower: "أقل بنسبة {p}%", metric: "المقياس", overall: "الفائز", draw: "تعادل",
    ratings: { excellent: "ممتاز", good: "جيد", fair: "مقبول", slow: "بطيء" },
  },
  providers: { title: "مزوّدوك", subtitle: "متوسطات اختباراتك وتقييم المجتمع.", tests: "اختبارات", best: "الأفضل", community: "تقييم المجتمع", reviewsN: "{n} تقييم", noReviews: "لا توجد تقييمات بعد", see: "عرض التقييمات", empty: "سيظهر مزوّدوك هنا بعد أول اختبار." },
  reviews: { title: "تقييماتي", empty: "لم تقيّم أي مزوّد بعد. أجرِ اختبارًا وقيّم مزوّدك.", status: { pending: "بانتظار تأكيد البريد", published: "منشور", hidden: "أخفاه المشرف" }, delete: "حذف التقييم", deleteConfirm: "حذف هذا التقييم نهائيًا؟", view: "عرض" },
  settings: {
    profile: "الملف الشخصي", profileText: "يظهر اسمك في التقييمات كالاسم الأول + الحرف الأول من اللقب.", save: "حفظ التغييرات", saved: "تم الحفظ.", email: "البريد الإلكتروني", verified: "مؤكَّد", notVerified: "غير مؤكَّد",
    password: "كلمة المرور", passwordText: "تغيير كلمة المرور يسجّل خروجك من الأجهزة الأخرى.", change: "تغيير كلمة المرور", changed: "تم تغيير كلمة المرور.",
    data: "بياناتك", dataText: "نزّل نسخة من ملفك واختباراتك وتقييماتك (JSON).", export: "تصدير بياناتي",
    danger: "حذف الحساب", dangerText: "يحذف حسابك وتقييماتك نهائيًا، وتصبح اختباراتك مجهولة الهوية. لا يمكن التراجع.", delete: "حذف حسابي", deleteConfirm: "أدخل كلمة المرور للتأكيد", deleted: "تم حذف حسابك.", cancel: "إلغاء",
    memberSince: "عضو منذ {date}",
  },
  prompt: {
    title: "احفظ هذه النتيجة وقارن المزوّدين", text: "أنشئ حسابًا مجانيًا لحفظ سجل اختباراتك ومقارنة اتصالين والاستفادة القصوى من الإنترنت.",
    benefits: ["سجل ورسوم بيانية", "قارن اختبارين أو مزوّدَين", "قيّم مزوّدك"], create: "أنشئ حسابًا مجانيًا", signIn: "تسجيل الدخول", dismiss: "إغلاق",
    savedTitle: "تم الحفظ في لوحتك", savedText: "هذا الاختبار في سجلك. قارنه باختبار أو مزوّد آخر.", viewTests: "اختباراتي", compare: "مقارنة",
  },
};

const ru: AccountMessages = {
  nav: { signIn: "Войти", createAccount: "Создать аккаунт", account: "Мой аккаунт", dashboard: "Панель", myTests: "Мои тесты", compare: "Сравнить", providers: "Мои провайдеры", reviews: "Мои отзывы", settings: "Настройки", signOut: "Выйти" },
  meta: { login: "Вход", signup: "Создайте бесплатный аккаунт", forgot: "Забыли пароль", reset: "Новый пароль", verify: "Подтверждение e-mail", dashboard: "Моя панель", desc: "Ваш аккаунт TestSpeedInternet: сохранённые тесты, сравнение провайдеров и отзывы." },
  fields: {
    name: "Полное имя", namePh: "например, Анна Петрова", email: "Электронная почта", emailPh: "you@example.com", phone: "Номер телефона", phonePh: "Номер телефона",
    country: "Страна", countryAuto: "Определена автоматически — при необходимости измените", password: "Пароль", passwordPh: "Минимум 8 символов", newPassword: "Новый пароль",
    currentPassword: "Текущий пароль", show: "Показать пароль", hide: "Скрыть пароль", searchCountry: "Поиск страны или кода", noCountries: "Страны не найдены", selectCountry: "Выберите страну",
    terms: "Я принимаю [Условия использования](/terms) и [Политику конфиденциальности](/privacy).", marketing: "Присылайте мне советы и новости (можно отписаться в любой момент).", language: "Язык писем",
  },
  strength: { label: "Надёжность пароля", weak: "Слабый", fair: "Средний", good: "Хороший", strong: "Надёжный" },
  errors: {
    generic: "Что-то пошло не так. Попробуйте ещё раз.", network: "Ошибка сети — проверьте подключение и повторите.", name: "Введите полное имя.", email: "Введите корректный e-mail.",
    phone: "Введите корректный номер телефона.", country: "Выберите страну.", short: "Минимум 8 символов.", weak: "Используйте буквы и хотя бы одну цифру.", terms: "Примите условия, чтобы продолжить.",
    captcha: "Пройдите проверку.", captchaFailed: "Проверка устарела. Пройдите её снова.", emailTaken: "Аккаунт с этим e-mail уже существует. Попробуйте войти.",
    badLogin: "Неверный e-mail или пароль.", tooMany: "Слишком много попыток. Подождите несколько минут.", disabled: "Аккаунт отключён. Обратитесь в поддержку.",
    wrongPassword: "Текущий пароль указан неверно.", tokenInvalid: "Ссылка недействительна или устарела.", notConfigured: "Аккаунты временно недоступны.",
    unverified: "Сначала подтвердите адрес электронной почты.",
    mailFailed: "Не удалось отправить письмо. Попробуйте позже или напишите на support@testspeedinternet.com.",
  },
  login: { title: "С возвращением", subtitle: "Войдите, чтобы видеть сохранённые тесты и сравнивать провайдеров.", submit: "Войти", forgot: "Забыли пароль?", noAccount: "Впервые на TestSpeedInternet?", create: "Создать бесплатный аккаунт" },
  signup: {
    title: "Создайте бесплатный аккаунт", subtitle: "Сохраняйте каждый тест, сравнивайте провайдеров и делитесь отзывами с другими клиентами.", submit: "Создать аккаунт", have: "Уже есть аккаунт?", signIn: "Войти",
    benefits: ["История всех ваших тестов скорости", "Сравнение двух тестов или двух провайдеров", "Оценивайте провайдера и читайте отзывы клиентов", "Бесплатно навсегда — без рекламы в панели"],
    claim: "Ваш последний результат будет сохранён в новом аккаунте.", doneTitle: "Аккаунт создан!", doneText: "Мы отправили ссылку для подтверждения на {email}. Перейдите по ней, чтобы подтвердить адрес.", mailFailed: "Аккаунт работает, но письмо с подтверждением сейчас не отправилось. Его можно отправить повторно из панели.", go: "Перейти в панель",
  },
  forgot: { title: "Забыли пароль?", subtitle: "Введите e-mail — мы пришлём ссылку для нового пароля.", submit: "Отправить ссылку", sentTitle: "Проверьте почту", sent: "Если аккаунт для {email} существует, ссылка уже в пути. Она действует 1 час.", back: "Назад ко входу" },
  reset: { title: "Задайте новый пароль", subtitle: "Выберите надёжный пароль, который вы больше нигде не используете.", submit: "Сохранить пароль", invalid: "Ссылка для сброса недействительна или устарела.", again: "Запросить новую ссылку" },
  verify: { okTitle: "E-mail подтверждён", okText: "Спасибо! Ваш адрес подтверждён, аккаунт полностью активен.", badTitle: "Ссылка устарела", badText: "Ссылка недействительна, уже использована или устарела. Войдите и запросите новую в панели.", dashboard: "Открыть панель", signIn: "Войти" },
  dash: {
    hello: "Привет, {name} 👋", subtitle: "Ваши тесты, сравнения и отзывы в одном месте.", runTest: "Новый тест",
    tabs: { overview: "Обзор", tests: "Мои тесты", compare: "Сравнить", providers: "Провайдеры", reviews: "Мои отзывы", settings: "Настройки" },
    verifyBanner: "Подтвердите e-mail ({email}). Отзывы публикуются после подтверждения адреса.", resend: "Отправить снова", resent: "Письмо отправлено.",
    gateTitle: "Подтвердите e-mail, чтобы открыть личный кабинет", gateText: "Мы отправили ссылку для подтверждения на {email}. Перейдите по ней, чтобы активировать аккаунт — после этого откроются ваши тесты, сравнения и отзывы.", gateRefresh: "Я подтвердил e-mail", gateNotYet: "Ещё не подтверждено — сначала откройте ссылку из письма.", gateSpam: "Не нашли письмо? Проверьте папку «Спам» или отправьте новую ссылку.", gateOther: "Войти в другой аккаунт",
    stats: { tests: "Тестов", avgDown: "Ср. загрузка", avgUp: "Ср. отдача", avgPing: "Ср. пинг", bestDown: "Лучшая загрузка" },
    chartTitle: "Ваша скорость во времени", chartEmpty: "Сделайте пару тестов, чтобы увидеть динамику.", emptyTitle: "Тестов пока нет", emptyText: "Запустите тест, войдя в аккаунт, — он сохранится здесь автоматически.", loading: "Загрузка…",
    latest: "Последние тесты", viewAll: "Все тесты",
  },
  tests: {
    date: "Дата", provider: "Провайдер", server: "Сервер", mode: "Тип", down: "Загрузка", up: "Отдача", ping: "Пинг", actions: "Действия", remove: "Удалить из истории", removeConfirm: "Удалить этот тест из истории?",
    compareSel: "Сравнить выбранные", selectHint: "Выберите два теста для сравнения.", unknown: "Неизвестный провайдер", modes: { full: "Полный тест", download: "Загрузка", upload: "Отдача", ping: "Пинг" }, count: "Тестов: {n}",
  },
  compare: {
    title: "Сравнение двух тестов", subtitle: "Выберите любые два теста — например, дом и офис или двух разных провайдеров.", a: "Тест A", b: "Тест B", choose: "Выберите тест",
    needTwo: "Для сравнения нужно минимум два сохранённых теста.", winner: "Лучше", tie: "Равно", faster: "быстрее на {p}%", lower: "ниже на {p}%", metric: "Показатель", overall: "Победитель", draw: "Ничья",
    ratings: { excellent: "Отлично", good: "Хорошо", fair: "Средне", slow: "Медленно" },
  },
  providers: { title: "Ваши провайдеры", subtitle: "Средние значения ваших тестов и рейтинг сообщества.", tests: "тестов", best: "Лучший", community: "Рейтинг сообщества", reviewsN: "Отзывов: {n}", noReviews: "Пока нет отзывов", see: "Отзывы", empty: "Провайдеры появятся здесь после первого теста." },
  reviews: { title: "Мои отзывы", empty: "Вы ещё не оценивали провайдера. Пройдите тест и оцените своего.", status: { pending: "Ждёт подтверждения e-mail", published: "Опубликован", hidden: "Скрыт модератором" }, delete: "Удалить отзыв", deleteConfirm: "Удалить этот отзыв навсегда?", view: "Открыть" },
  settings: {
    profile: "Профиль", profileText: "В отзывах имя показывается как имя + инициал фамилии.", save: "Сохранить", saved: "Сохранено.", email: "E-mail", verified: "Подтверждён", notVerified: "Не подтверждён",
    password: "Пароль", passwordText: "Смена пароля завершит сеансы на других устройствах.", change: "Сменить пароль", changed: "Пароль изменён.",
    data: "Ваши данные", dataText: "Скачайте копию профиля, тестов и отзывов (JSON).", export: "Экспорт данных",
    danger: "Удаление аккаунта", dangerText: "Аккаунт и отзывы будут удалены навсегда, тесты — обезличены. Отменить нельзя.", delete: "Удалить аккаунт", deleteConfirm: "Введите пароль для подтверждения", deleted: "Ваш аккаунт удалён.", cancel: "Отмена",
    memberSince: "С нами с {date}",
  },
  prompt: {
    title: "Сохраните результат и сравните провайдеров", text: "Создайте бесплатный аккаунт, чтобы хранить историю тестов, сравнивать подключения и выжать максимум из интернета.",
    benefits: ["История и графики", "Сравнение 2 тестов или провайдеров", "Отзыв о провайдере"], create: "Создать аккаунт", signIn: "Войти", dismiss: "Закрыть",
    savedTitle: "Сохранено в вашей панели", savedText: "Тест добавлен в историю. Сравните его с другим тестом или провайдером.", viewTests: "Мои тесты", compare: "Сравнить",
  },
};

export const accountMessages: Record<Locale, AccountMessages> = { en, fr, es, ar, ru };

/** Replace {key} placeholders. */
export const fmt = (s: string, vars: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
