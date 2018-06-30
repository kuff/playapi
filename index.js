const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const si = require('systeminformation');

const app = express();
const dir = '/ftb2/backups/';
const path = __dirname + dir

app.use(helmet());

app.get('/', (req, res) => {
    res.redirect('http://www.papupa.com');
});

app.get('/getbackups', (req, res) => {

    if(!fs.existsSync(path)) return res.status(404)
        .send('Unable to locate target directory!');
    
    fs.readFile(path + 'backups.json', 'utf8', (err, data) => {

        if (err) return res.status(404)
            .send('Unable to open backups.json!');

        res.send(JSON.parse(data));

    });

});

app.get('/getfile/:name', (req, res) => {

    const options = {
        root: path
    }
    const file_name = req.params.name;

    res.sendFile(file_name, options, err => {
        if (err) res.status(404)
            .send('Unable to locate ' + file_name + '!');
    });

});

app.get('/getstats', async (req, res) => {

    const time = await si.time();
    const cpu = await si.cpuCurrentspeed();
    const load = await si.currentLoad();
    const mem = await si.mem();
    const fs = await si.fsSize();
    const disc = await si.disksIO();

    const info = {
        uptime: time.uptime,
        cpu_avg: cpu.avg,
        current_load: load.currentload,
        average_load: load.avgload,
        memory_used: mem.used,
        memory_total: mem.total,
        fs_used: fs.used,
        fs_size: fs.size,
        disc_read: disc.rIO,
        disc_write: disc.wIO
    }

    res.send(info);

});

app.listen(3000, () => console.log('Listening to port 3000!'));