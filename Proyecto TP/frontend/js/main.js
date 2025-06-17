
function shadowHeader() {
    const scrollHeader = () => {
    const header = document.getElementById('header')
    /* Explicación de lo que sigue abajo:
     - this.scrollY --> es un operador ternario, que evalua la cantidad de pixeles que se fue el usuario para abajo o para arriba.
     ? --> parte verdadera
     : --> parte falsa
     
     --> si es verdadera se crea la clase CSS que agregará los efectos
     --> si es falso se desactiva y se remueve la clase CSS
     
     returns: si el usuario se desplaza hacia abajo 50 pixeles o mas, cambia la clase de 'header' a 'scroll-header' (scroll-header) donde se activa una sombra (ya se agrego la clase a CSS)
              si el usuario no se desplazo, o vuelve para arriba de todo, se elimina la clase y la sombra.*/
    this.scrollY >= 50 ? header.classList.add('scroll-header') : header.classList.remove('scroll-header')
    }
    /* window --> ventana del navegador
     'scroll' --> tipo de evento que se espera, se dispara cada vez que el usuario se desplaza por la página
     scrollHeader --> es la función que se llamará cada vez que ocurra el evento 'scroll' */
    window.addEventListener('scroll', scrollHeader)
    console.clear()
}

/* Para ordenar el codigo, se invoca a todas las funciones hechas, en el main.*/
function main() {
    shadowHeader()
}

main()