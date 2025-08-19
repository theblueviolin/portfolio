function scrollToElm(elm){
    let element = document.getElementById(elm);
    let position = element.getBoundingClientRect();
    window.scrollTo(position.left, position.top + window.scrollY - 125);
}

// let about = document.getElementById('about')
// let projects = document.getElementById('projects')
// let experience = document.getElementById('experience')

// let navA = document.getElementsByTagName('nav')[0].children[0]
// let navP = document.getElementsByTagName('nav')[0].children[1]
// let navE = document.getElementsByTagName('nav')[0].children[2]

// let mid = document.getElementById('closestIndicator')
// document.addEventListener("scroll", function(){
//     // console.log(mid.closest("article"))

//     // let a = about.getBoundingClientRect();
//     // let p = projects.getBoundingClientRect();
//     // let e = experience.getBoundingClientRect();
//     // if (a > p && a > e){
//     //     navA.classList.add('navItemCur')
//     //     navP.classList.remove('navItemCur')
//     //     navE.classList.remove('navItemCur')
//     // }
//     // else if(p > a && p > e){
//     //     navA.classList.remove('navItemCur')
//     //     navP.classList.add('navItemCur')
//     //     navE.classList.remove('navItemCur')
//     // }
//     // else if (e > a && e > p){
//     //     navA.classList.remove('navItemCur')
//     //     navP.classList.remove('navItemCur')
//     //     navE.classList.add('navItemCur')
//     // }
//     // navE.classList.add('navItemCur')
// });