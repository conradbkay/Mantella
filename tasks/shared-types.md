The frontend should get most of its types from the server, now that the tsconfig makes it shared

Use shared/types-gen.ts mostly for now

That will likely cause many errors, but remember not to change types-gen.ts ever! It's auto-generated

You need to fix the client to use things like how they are returned in the API now that the database migrated

You can make types in types.ts, which you may need to do to mirror how the server routes join table rows and such

Generally you should look for places in the codebase where manually types are used that could be replaced by stuff in types-gen
