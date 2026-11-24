#!/usr/bin/env node
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.join(__dirname,'assets/models');
const manifests=fs.readdirSync(root).filter(x=>/^import-\d+\.json$/.test(x)).flatMap(x=>JSON.parse(fs.readFileSync(path.join(root,x))).manifest);
const expected=new Map(manifests.map(x=>[x.dest+'.glb',x]));
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root).filter(x=>x.endsWith('.glb'));assert.equal(expected.size,55);assert.equal(files.length,55);
for(const file of files){const rel=path.relative(root,file).split(path.sep).join('/'),meta=expected.get(rel),b=fs.readFileSync(file);assert(meta,'unexpected '+rel);assert(b.length>=20,rel);assert.equal(b.toString('ascii',0,4),'glTF',rel);assert.equal(b.readUInt32LE(4),2,rel);assert.equal(b.readUInt32LE(8),b.length,rel);assert.equal(b.length,meta.bytes,rel);assert.equal(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex'),meta.sha,rel);let json,bin=0;
for(let off=12;off<b.length;){assert(off+8<=b.length,rel);const n=b.readUInt32LE(off),t=b.readUInt32LE(off+4);off+=8;assert(n%4===0&&off+n<=b.length,rel);if(t===0x4e4f534a)json=JSON.parse(b.toString('utf8',off,off+n));else if(t===0x004e4942)bin=n;off+=n;}
assert(json?.asset?.version==='2.0'&&json.meshes?.length,rel);assert((json.buffers?.[0]?.byteLength||0)<=bin,rel);for(const a of [...(json.buffers||[]),...(json.images||[])])assert(!a.uri||a.uri.startsWith('data:'),rel+' external resource');assert.deepEqual((json.animations||[]).map(x=>x.name||''),meta.clips,rel);}
console.log('PASS: '+files.length+' local GLB files, header, version, size, chunk structure, self-contained data, Git SHA and animation names.');
