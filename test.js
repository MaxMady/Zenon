const balls = require("./commands/balls");

let UID = ``
(async () => {
    let user = await db.get(`user-${UID}`);
    let bally = user.balls

    bally.forEach(async e => {
        let bb = await balls.get(`balls-${e}`)
        
    })
})