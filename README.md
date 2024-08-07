# BEST_REZO
Ce repository est une demonstration d'un MVP de réseau social en architecture micro service.
La stack utilisée est MongoDB avec Mongose comme ORM, Express comme framework HTTP et Node.js comme environnement.
L'authentification se fait par JWT et le hashing de MDP par Bcrypt.

 - User_ms  : Gére l'envois de la liste des users du site
 - Posts_ms : Gére la création de posts ainsi que l'envois du newsFeed d'un user en récupérant ses cinqs derniers posts le tout protéger par un middleware AuthZ empêchant les user non connectés d'utiliser le service
 - AuthN_ms : Gére les routes d'authentification, de login et de création d'user
 - Token_ms : Gére la délivrance et la vérification du token
