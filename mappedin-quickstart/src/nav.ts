const navBar = `
<style>
  nav {
    background-color: #ffffff; /* Dark blue color */
    color: rgb(15, 34, 64);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 0 1rem;
    font-weight: bold;
  }
  .logo {
    height: 40px;
  }
  .nav-links {
    display: flex;
    align-items: center;
  }
  .nav-links a {
    color: rgb(15, 23, 47);
    text-decoration: none;
    margin: 0 1.5rem;
    font-size: 1rem;
    transition: color 0.3s, transform 0.3s;
  }
  .nav-links a:hover {
    color: #ffcc00;
    transform: scale(1.05);
  }
</style>
<nav>
  <img src="logo.png" alt="Logo" class="logo" />
  <div class="nav-links">
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="#">Contact</a>
  </div>
</nav>
`;

export default navBar;