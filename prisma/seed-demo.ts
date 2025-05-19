// prisma/seed-demo.ts
import { prisma } from '@/lib/prisma';
import { computeRpi } from '@/lib/rpi';
import bcrypt from 'bcryptjs';

async function main(){
  const equip = await prisma.equipment.create({
    data:{ name:'Conveyor A' }
  });
  const row = await prisma.fmecaRow.create({
    data:{
      equipmentId: equip.id,
      failureMode:'Belt slip',
      effect:'Downtime',
      severity:4, occurrence:3, detection:2,
      rpi: computeRpi(4,3,2)
    }
  });
  await prisma.task.create({
    data:{
      description:'Inspect belt tension',
      priority:5,
      fmecaRowId: row.id
    }
  });
  await prisma.user.createMany({
    data:[
      { id:'tech1', username:'tech', password:bcrypt.hashSync('pass',10), role:'TECH' },
      { id:'mgr1',  username:'mgr',  password:bcrypt.hashSync('pass',10), role:'MANAGER' }
    ]
  });
}
main().then(()=>process.exit());
