exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    owner_id: { type: 'uuid', notNull: true },
    title: { type: 'text' },
    company: { type: 'text' },
    location: { type: 'text' },
    salary: { type: 'text' },
    description: { type: 'text' },
    published: { type: 'boolean', default: false },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') }
  })
  pgm.createIndex('jobs', 'owner_id')

  pgm.createTable('resumes', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    owner_id: { type: 'uuid', notNull: true },
    file_url: { type: 'text' },
    extracted_text: { type: 'text' },
    parsed: { type: 'jsonb' },
    created_at: { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') }
  })
  pgm.createIndex('resumes', 'owner_id')

  // Enable RLS and create policies
  pgm.sql(`ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;`)
  pgm.sql(`ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;`)

  pgm.sql(`CREATE POLICY allow_insert_if_owner ON jobs FOR INSERT USING (true) WITH CHECK (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_select_if_owner ON jobs FOR SELECT USING (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_update_if_owner ON jobs FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_delete_if_owner ON jobs FOR DELETE USING (owner_id = auth.uid());`)

  pgm.sql(`CREATE POLICY allow_insert_if_owner_resumes ON resumes FOR INSERT USING (true) WITH CHECK (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_select_if_owner_resumes ON resumes FOR SELECT USING (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_update_if_owner_resumes ON resumes FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());`)
  pgm.sql(`CREATE POLICY allow_delete_if_owner_resumes ON resumes FOR DELETE USING (owner_id = auth.uid());`)

  pgm.sql(`CREATE POLICY public_select_published_jobs ON jobs FOR SELECT USING (published = true);`)
}

exports.down = (pgm) => {
  pgm.sql(`DROP POLICY IF EXISTS public_select_published_jobs ON jobs;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_delete_if_owner_resumes ON resumes;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_update_if_owner_resumes ON resumes;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_select_if_owner_resumes ON resumes;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_insert_if_owner_resumes ON resumes;`)

  pgm.sql(`DROP POLICY IF EXISTS allow_delete_if_owner ON jobs;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_update_if_owner ON jobs;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_select_if_owner ON jobs;`)
  pgm.sql(`DROP POLICY IF EXISTS allow_insert_if_owner ON jobs;`)

  pgm.dropTable('resumes')
  pgm.dropTable('jobs')
}
