

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$begin
  insert into public.users (id, email, role, region)
  values (
    new.id,
    new.email,         -- You can replace this with `null` or extract name from metadata if preferred
    'salesman',        -- Default role
    null               -- Default region (editable later)
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."announcements" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text",
    "message" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "address" "text",
    "region" "text",
    "assigned_salesman" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."deliveries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "order_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "delivery_date" "date",
    "notes" "text",
    CONSTRAINT "deliveries_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'in_transit'::"text", 'delivered'::"text"])))
);


ALTER TABLE "public"."deliveries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "order_id" "uuid",
    "product_id" "uuid",
    "quantity" integer NOT NULL,
    "unit_price" numeric(10,2) NOT NULL,
    "subtotal" numeric(10,2) GENERATED ALWAYS AS ((("quantity")::numeric * "unit_price")) STORED
);


ALTER TABLE "public"."order_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "customer_id" "uuid",
    "salesman_id" "uuid",
    "status" "text" DEFAULT 'draft'::"text",
    "total" numeric(10,2) DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'confirmed'::"text", 'shipped'::"text", 'delivered'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text" NOT NULL,
    "sku" "text",
    "description" "text",
    "price" numeric(10,2) NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "category" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "role" "text" DEFAULT 'salesman'::"text" NOT NULL,
    "region" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "email" "text",
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['salesman'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."deliveries"
    ADD CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_assigned_salesman_fkey" FOREIGN KEY ("assigned_salesman") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."deliveries"
    ADD CONSTRAINT "deliveries_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_salesman_id_fkey" FOREIGN KEY ("salesman_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Access order items of own orders" ON "public"."order_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."orders" "o"
  WHERE (("o"."id" = "order_items"."order_id") AND ("o"."salesman_id" = "auth"."uid"())))));



CREATE POLICY "All users can view announcements" ON "public"."announcements" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "All users can view products" ON "public"."products" FOR SELECT USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Allow inserts from supabase_auth_admin" ON "public"."users" FOR INSERT TO "supabase_auth_admin" WITH CHECK (true);



CREATE POLICY "Authenticated users can view everyone's profile" ON "public"."users" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable delete for users based on user_id" ON "public"."users" FOR DELETE USING (((( SELECT "auth"."uid"() AS "uid") = "id") OR (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "Enable update for users based on user_id" ON "public"."users" FOR UPDATE USING (((( SELECT "auth"."uid"() AS "uid") = "id") OR (EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND ("u"."role" = 'admin'::"text"))))));



CREATE POLICY "Salesman can delete own customers" ON "public"."customers" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("customers"."assigned_salesman" = "u"."id"))))));



CREATE POLICY "Salesman can delete own orders" ON "public"."orders" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("orders"."salesman_id" = "u"."id"))))));



CREATE POLICY "Salesman can insert customers" ON "public"."customers" FOR INSERT WITH CHECK (("auth"."uid"() = "assigned_salesman"));



CREATE POLICY "Salesman can insert orders" ON "public"."orders" FOR INSERT WITH CHECK (("auth"."uid"() = "salesman_id"));



CREATE POLICY "Salesman can update own customers" ON "public"."customers" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("customers"."assigned_salesman" = "u"."id")))))) WITH CHECK (("auth"."uid"() = "assigned_salesman"));



CREATE POLICY "Salesman can update own orders" ON "public"."orders" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("orders"."salesman_id" = "u"."id")))))) WITH CHECK (("auth"."uid"() = "salesman_id"));



CREATE POLICY "Salesman can view assigned customers" ON "public"."customers" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("customers"."assigned_salesman" = "u"."id"))))));



CREATE POLICY "Salesman can view own orders" ON "public"."orders" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."users" "u"
  WHERE (("u"."id" = "auth"."uid"()) AND (("u"."role" = 'admin'::"text") OR ("orders"."salesman_id" = "u"."id"))))));



ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."deliveries" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."deliveries" TO "anon";
GRANT ALL ON TABLE "public"."deliveries" TO "authenticated";
GRANT ALL ON TABLE "public"."deliveries" TO "service_role";



GRANT ALL ON TABLE "public"."order_items" TO "anon";
GRANT ALL ON TABLE "public"."order_items" TO "authenticated";
GRANT ALL ON TABLE "public"."order_items" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";
GRANT INSERT ON TABLE "public"."users" TO "supabase_auth_admin";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























RESET ALL;
