export interface Env {
  DB: any; // D1Database
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results: projects } = await context.env.DB.prepare("SELECT * FROM projects").all();
    const { results: pages } = await context.env.DB.prepare("SELECT * FROM pages").all();
    
    return Response.json({
      projects: projects.map((p: any) => JSON.parse(p.data)),
      pages: pages.map((p: any) => JSON.parse(p.data))
    });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const data = await context.request.json() as any;
    
    if (data.projects) {
      await context.env.DB.prepare("DELETE FROM projects").run();
      for (const p of data.projects) {
        await context.env.DB.prepare("INSERT INTO projects (id, data) VALUES (?, ?)").bind(p.id, JSON.stringify(p)).run();
      }
    }
    
    if (data.pages) {
      await context.env.DB.prepare("DELETE FROM pages").run();
      for (const p of data.pages) {
        await context.env.DB.prepare("INSERT INTO pages (id, data) VALUES (?, ?)").bind(p.id, JSON.stringify(p)).run();
      }
    }

    return Response.json({ success: true });
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
};
