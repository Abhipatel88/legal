export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          is_deleted: boolean | null
          metadata: Json | null
          module: string
          timestamp: string | null
          updated_at: string | null
          updated_by: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          metadata?: Json | null
          module: string
          timestamp?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          metadata?: Json | null
          module?: string
          timestamp?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      approval_settings: {
        Row: {
          approval_levels: number | null
          auto_approve_limit: number | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          module: string
          settings: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          approval_levels?: number | null
          auto_approve_limit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          module: string
          settings?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          approval_levels?: number | null
          auto_approve_limit?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          module?: string
          settings?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          break_hours: number | null
          created_at: string | null
          created_by: string | null
          date: string
          employee_id: string
          half_day_type: Database["public"]["Enums"]["half_day_type"] | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_verified: boolean | null
          overtime_hours: number | null
          punch_in_time: string | null
          punch_out_time: string | null
          remarks: string | null
          status: Database["public"]["Enums"]["attendance_status"] | null
          total_hours: number | null
          updated_at: string | null
          updated_by: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          break_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          date: string
          employee_id: string
          half_day_type?: Database["public"]["Enums"]["half_day_type"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          overtime_hours?: number | null
          punch_in_time?: string | null
          punch_out_time?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          break_hours?: number | null
          created_at?: string | null
          created_by?: string | null
          date?: string
          employee_id?: string
          half_day_type?: Database["public"]["Enums"]["half_day_type"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          overtime_hours?: number | null
          punch_in_time?: string | null
          punch_out_time?: string | null
          remarks?: string | null
          status?: Database["public"]["Enums"]["attendance_status"] | null
          total_hours?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          changed_fields: string[] | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string
          table_name: string
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id: string
          table_name: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          changed_fields?: string[] | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string
          table_name?: string
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          city: string | null
          company_name: string
          country: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          logo_url: string | null
          phone: string | null
          postal_code: string | null
          registration_number: string | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_name: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          logo_url?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_name?: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          logo_url?: string | null
          phone?: string | null
          postal_code?: string | null
          registration_number?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contract_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          employee_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_groups_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_holidays: {
        Row: {
          contract_id: string
          created_at: string | null
          created_by: string | null
          holiday_id: string
          id: string
          is_active: boolean | null
          is_applicable: boolean | null
          is_deleted: boolean | null
          remarks: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contract_id: string
          created_at?: string | null
          created_by?: string | null
          holiday_id: string
          id?: string
          is_active?: boolean | null
          is_applicable?: boolean | null
          is_deleted?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contract_id?: string
          created_at?: string | null
          created_by?: string | null
          holiday_id?: string
          id?: string
          is_active?: boolean | null
          is_applicable?: boolean | null
          is_deleted?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_holidays_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_holidays_holiday_id_fkey"
            columns: ["holiday_id"]
            isOneToOne: false
            referencedRelation: "holidays"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_leaves: {
        Row: {
          carry_forward: boolean | null
          contract_id: string
          created_at: string | null
          created_by: string | null
          days_allowed: number
          encashable: boolean | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          leave_type_id: string
          notes: string | null
          salary_payable: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          carry_forward?: boolean | null
          contract_id: string
          created_at?: string | null
          created_by?: string | null
          days_allowed: number
          encashable?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id: string
          notes?: string | null
          salary_payable?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          carry_forward?: boolean | null
          contract_id?: string
          created_at?: string | null
          created_by?: string | null
          days_allowed?: number
          encashable?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id?: string
          notes?: string | null
          salary_payable?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_leaves_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_leaves_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_revisions: {
        Row: {
          approved_by: string | null
          changes: Json
          contract_id: string
          created_at: string | null
          created_by: string | null
          effective_date: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          reason: string | null
          revision_date: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          approved_by?: string | null
          changes: Json
          contract_id: string
          created_at?: string | null
          created_by?: string | null
          effective_date: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          reason?: string | null
          revision_date?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          approved_by?: string | null
          changes?: Json
          contract_id?: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          reason?: string | null
          revision_date?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_revisions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_templates: {
        Row: {
          content: string
          contract_type_id: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
          variables: Json | null
          version: number | null
        }
        Insert: {
          content: string
          contract_type_id: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
          version?: number | null
        }
        Update: {
          content?: string
          contract_type_id?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_templates_contract_type_id_fkey"
            columns: ["contract_type_id"]
            isOneToOne: false
            referencedRelation: "contract_types"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_type_required_documents: {
        Row: {
          contract_type_id: string
          created_at: string | null
          created_by: string | null
          document_type: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_mandatory: boolean | null
          remarks: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contract_type_id: string
          created_at?: string | null
          created_by?: string | null
          document_type: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_mandatory?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contract_type_id?: string
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_mandatory?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contract_type_required_documents_contract_type_id_fkey"
            columns: ["contract_type_id"]
            isOneToOne: false
            referencedRelation: "contract_types"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_types: {
        Row: {
          code: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          basic_salary: number
          contract_group_id: string | null
          contract_template_id: string | null
          contract_type_id: string
          created_at: string | null
          created_by: string | null
          employee_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          notice_period: number | null
          overtime_allowed: boolean | null
          overtime_rate: number | null
          probation_period: number | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          updated_at: string | null
          updated_by: string | null
          version: number
          work_week_id: string | null
        }
        Insert: {
          basic_salary: number
          contract_group_id?: string | null
          contract_template_id?: string | null
          contract_type_id: string
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          notice_period?: number | null
          overtime_allowed?: boolean | null
          overtime_rate?: number | null
          probation_period?: number | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number
          work_week_id?: string | null
        }
        Update: {
          basic_salary?: number
          contract_group_id?: string | null
          contract_template_id?: string | null
          contract_type_id?: string
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          notice_period?: number | null
          overtime_allowed?: boolean | null
          overtime_rate?: number | null
          probation_period?: number | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number
          work_week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_contract_group_id_fkey"
            columns: ["contract_group_id"]
            isOneToOne: false
            referencedRelation: "contract_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_contract_template_id_fkey"
            columns: ["contract_template_id"]
            isOneToOne: false
            referencedRelation: "contract_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_contract_type_id_fkey"
            columns: ["contract_type_id"]
            isOneToOne: false
            referencedRelation: "contract_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_work_week_id_fkey"
            columns: ["work_week_id"]
            isOneToOne: false
            referencedRelation: "work_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_widgets: {
        Row: {
          configuration: Json
          created_at: string | null
          created_by: string | null
          dashboard_id: string
          height: number
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          position_x: number
          position_y: number
          title: string
          updated_at: string | null
          updated_by: string | null
          widget_type: string
          width: number
        }
        Insert: {
          configuration: Json
          created_at?: string | null
          created_by?: string | null
          dashboard_id: string
          height?: number
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          position_x?: number
          position_y?: number
          title: string
          updated_at?: string | null
          updated_by?: string | null
          widget_type: string
          width?: number
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          created_by?: string | null
          dashboard_id?: string
          height?: number
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          position_x?: number
          position_y?: number
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          widget_type?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_widgets_dashboard_id_fkey"
            columns: ["dashboard_id"]
            isOneToOne: false
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboards: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_deleted: boolean | null
          layout: Json
          name: string
          role_id: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean | null
          layout: Json
          name: string
          role_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_deleted?: boolean | null
          layout?: Json
          name?: string
          role_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      data_exports: {
        Row: {
          created_at: string | null
          created_by: string | null
          downloaded_at: string | null
          expires_at: string | null
          export_type: string
          file_size_bytes: number | null
          file_url: string | null
          filters: Json | null
          format: Database["public"]["Enums"]["report_format"] | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          record_count: number | null
          status: string | null
          table_name: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          export_type: string
          file_size_bytes?: number | null
          file_url?: string | null
          filters?: Json | null
          format?: Database["public"]["Enums"]["report_format"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          record_count?: number | null
          status?: string | null
          table_name: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          downloaded_at?: string | null
          expires_at?: string | null
          export_type?: string
          file_size_bytes?: number | null
          file_url?: string | null
          filters?: Json | null
          format?: Database["public"]["Enums"]["report_format"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          record_count?: number | null
          status?: string | null
          table_name?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          head_employee_id: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          head_employee_id?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          head_employee_id?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_departments_head_employee"
            columns: ["head_employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      designations: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "designations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          body: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          subject: string
          template_type: Database["public"]["Enums"]["template_type"] | null
          updated_at: string | null
          updated_by: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          subject: string
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          subject?: string
          template_type?: Database["public"]["Enums"]["template_type"] | null
          updated_at?: string | null
          updated_by?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      employee_bank_details: {
        Row: {
          account_holder_name: string
          account_number: string
          bank_name: string
          branch_name: string | null
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          ifsc_code: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_primary: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          account_holder_name: string
          account_number: string
          bank_name: string
          branch_name?: string | null
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          ifsc_code: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_primary?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          account_holder_name?: string
          account_number?: string
          bank_name?: string
          branch_name?: string | null
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          ifsc_code?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_primary?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_bank_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          document_type: string
          employee_id: string
          file_url: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_verified: boolean | null
          remarks: string | null
          updated_at: string | null
          updated_by: string | null
          uploaded_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type: string
          employee_id: string
          file_url: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          employee_id?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_verified?: boolean | null
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
          uploaded_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_employee_documents_contract"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_salary_components: {
        Row: {
          created_at: string | null
          created_by: string | null
          effective_from: string
          effective_to: string | null
          employee_id: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          salary_component_id: string
          updated_at: string | null
          updated_by: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          effective_from: string
          effective_to?: string | null
          employee_id: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          salary_component_id: string
          updated_at?: string | null
          updated_by?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          salary_component_id?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_salary_components_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_salary_components_salary_component_id_fkey"
            columns: ["salary_component_id"]
            isOneToOne: false
            referencedRelation: "salary_components"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_shifts: {
        Row: {
          created_at: string | null
          created_by: string | null
          employee_id: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          shift_id: string
          updated_at: string | null
          updated_by: string | null
          work_week_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          shift_id: string
          updated_at?: string | null
          updated_by?: string | null
          work_week_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          shift_id?: string
          updated_at?: string | null
          updated_by?: string | null
          work_week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_shifts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_shifts_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_shifts_work_week_id_fkey"
            columns: ["work_week_id"]
            isOneToOne: false
            referencedRelation: "work_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          company_email: string
          created_at: string | null
          created_by: string | null
          department_id: string | null
          designation_id: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_code: string
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          onboarding_status:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          profile_picture_url: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
          work_phone: string | null
        }
        Insert: {
          company_email: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          designation_id?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code: string
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          profile_picture_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
          work_phone?: string | null
        }
        Update: {
          company_email?: string
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          designation_id?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code?: string
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          hire_date?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          onboarding_status?:
            | Database["public"]["Enums"]["onboarding_status"]
            | null
          profile_picture_url?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
          work_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_designation_id_fkey"
            columns: ["designation_id"]
            isOneToOne: false
            referencedRelation: "designations"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          start_date: string
          type: Database["public"]["Enums"]["holiday_type"] | null
          updated_at: string | null
          updated_by: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          start_date: string
          type?: Database["public"]["Enums"]["holiday_type"] | null
          updated_at?: string | null
          updated_by?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          start_date?: string
          type?: Database["public"]["Enums"]["holiday_type"] | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number
        }
        Relationships: []
      }
      leave_accrual_rules: {
        Row: {
          accrual_value: number
          applicable_after_days: number | null
          apply_to_probation: boolean | null
          created_at: string | null
          custom_conditions: Json | null
          deleted_at: string | null
          frequency_days: number | null
          frequency_months: number | null
          id: string
          leave_type_id: string
          max_days_per_year: number | null
          min_attendance_required: number | null
          min_working_days: number | null
          notes: string | null
          rule_type: string | null
          updated_at: string | null
        }
        Insert: {
          accrual_value: number
          applicable_after_days?: number | null
          apply_to_probation?: boolean | null
          created_at?: string | null
          custom_conditions?: Json | null
          deleted_at?: string | null
          frequency_days?: number | null
          frequency_months?: number | null
          id?: string
          leave_type_id: string
          max_days_per_year?: number | null
          min_attendance_required?: number | null
          min_working_days?: number | null
          notes?: string | null
          rule_type?: string | null
          updated_at?: string | null
        }
        Update: {
          accrual_value?: number
          applicable_after_days?: number | null
          apply_to_probation?: boolean | null
          created_at?: string | null
          custom_conditions?: Json | null
          deleted_at?: string | null
          frequency_days?: number | null
          frequency_months?: number | null
          id?: string
          leave_type_id?: string
          max_days_per_year?: number | null
          min_attendance_required?: number | null
          min_working_days?: number | null
          notes?: string | null
          rule_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_accrual_rules_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_approval_workflow: {
        Row: {
          action_date: string | null
          approver_id: string
          comments: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          leave_request_id: string
          level: number
          status: Database["public"]["Enums"]["approval_status"] | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          action_date?: string | null
          approver_id: string
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_request_id: string
          level: number
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          action_date?: string | null
          approver_id?: string
          comments?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_request_id?: string
          level?: number
          status?: Database["public"]["Enums"]["approval_status"] | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_approval_workflow_leave_request_id_fkey"
            columns: ["leave_request_id"]
            isOneToOne: false
            referencedRelation: "leave_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          allocated_days: number
          carried_forward: number | null
          created_at: string | null
          created_by: string | null
          employee_id: string
          encashed_days: number | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          leave_type_id: string
          remaining_days: number | null
          updated_at: string | null
          updated_by: string | null
          used_days: number | null
          year: number
        }
        Insert: {
          allocated_days: number
          carried_forward?: number | null
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          encashed_days?: number | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id: string
          remaining_days?: number | null
          updated_at?: string | null
          updated_by?: string | null
          used_days?: number | null
          year: number
        }
        Update: {
          allocated_days?: number
          carried_forward?: number | null
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          encashed_days?: number | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id?: string
          remaining_days?: number | null
          updated_at?: string | null
          updated_by?: string | null
          used_days?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          applied_at: string | null
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          created_at: string | null
          created_by: string | null
          emergency_contact: string | null
          employee_id: string
          end_date: string
          half_day_type: Database["public"]["Enums"]["half_day_type"] | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          leave_type_id: string
          reason: string
          rejection_reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          total_days: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          applied_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          emergency_contact?: string | null
          employee_id: string
          end_date: string
          half_day_type?: Database["public"]["Enums"]["half_day_type"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id: string
          reason: string
          rejection_reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          total_days: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          applied_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string | null
          created_by?: string | null
          emergency_contact?: string | null
          employee_id?: string
          end_date?: string
          half_day_type?: Database["public"]["Enums"]["half_day_type"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_type_id?: string
          reason?: string
          rejection_reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          total_days?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          carry_forward: boolean | null
          code: string
          created_at: string | null
          created_by: string | null
          days_allowed: number | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          salary_payable: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          carry_forward?: boolean | null
          code: string
          created_at?: string | null
          created_by?: string | null
          days_allowed?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          salary_payable?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          carry_forward?: boolean | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          days_allowed?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          salary_payable?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          created_by: string | null
          data: Json | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          message: string
          read_at: string | null
          title: string
          type: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          created_by?: string | null
          data?: Json | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payroll: {
        Row: {
          basic_salary: number
          created_at: string | null
          created_by: string | null
          employee_id: string
          generated_at: string | null
          gross_salary: number
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          leave_days: number | null
          net_salary: number
          overtime_amount: number | null
          overtime_hours: number | null
          paid_at: string | null
          payment_method: string | null
          payroll_period_id: string
          present_days: number
          remarks: string | null
          status: Database["public"]["Enums"]["payroll_status"] | null
          total_deductions: number
          transaction_id: string | null
          updated_at: string | null
          updated_by: string | null
          working_days: number
        }
        Insert: {
          basic_salary: number
          created_at?: string | null
          created_by?: string | null
          employee_id: string
          generated_at?: string | null
          gross_salary: number
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_days?: number | null
          net_salary: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payroll_period_id: string
          present_days: number
          remarks?: string | null
          status?: Database["public"]["Enums"]["payroll_status"] | null
          total_deductions?: number
          transaction_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          working_days: number
        }
        Update: {
          basic_salary?: number
          created_at?: string | null
          created_by?: string | null
          employee_id?: string
          generated_at?: string | null
          gross_salary?: number
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          leave_days?: number | null
          net_salary?: number
          overtime_amount?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          payment_method?: string | null
          payroll_period_id?: string
          present_days?: number
          remarks?: string | null
          status?: Database["public"]["Enums"]["payroll_status"] | null
          total_deductions?: number
          transaction_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_components: {
        Row: {
          amount: number
          calculated_value: number | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          payroll_id: string
          salary_component_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount: number
          calculated_value?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          payroll_id: string
          salary_component_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount?: number
          calculated_value?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          payroll_id?: string
          salary_component_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_components_payroll_id_fkey"
            columns: ["payroll_id"]
            isOneToOne: false
            referencedRelation: "payroll"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_components_salary_component_id_fkey"
            columns: ["salary_component_id"]
            isOneToOne: false
            referencedRelation: "salary_components"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          created_by: string | null
          end_date: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          month: number
          name: string
          processed_at: string | null
          processed_by: string | null
          start_date: string
          status: Database["public"]["Enums"]["payroll_status"] | null
          updated_at: string | null
          updated_by: string | null
          year: number
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          month: number
          name: string
          processed_at?: string | null
          processed_by?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["payroll_status"] | null
          updated_at?: string | null
          updated_by?: string | null
          year: number
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          month?: number
          name?: string
          processed_at?: string | null
          processed_by?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["payroll_status"] | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number
        }
        Relationships: []
      }
      permissions: {
        Row: {
          can_add: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          module: string
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          can_add?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          module: string
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          can_add?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          module?: string
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      policies: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          created_by: string | null
          effective_date: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Relationships: []
      }
      punch_records: {
        Row: {
          attendance_id: string | null
          created_at: string | null
          created_by: string | null
          device_info: Json | null
          employee_id: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          location_lat: number | null
          location_lng: number | null
          photo_url: string | null
          punch_time: string
          punch_type: Database["public"]["Enums"]["punch_type"]
          remarks: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          attendance_id?: string | null
          created_at?: string | null
          created_by?: string | null
          device_info?: Json | null
          employee_id: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          photo_url?: string | null
          punch_time: string
          punch_type: Database["public"]["Enums"]["punch_type"]
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          attendance_id?: string | null
          created_at?: string | null
          created_by?: string | null
          device_info?: Json | null
          employee_id?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          photo_url?: string | null
          punch_time?: string
          punch_type?: Database["public"]["Enums"]["punch_type"]
          remarks?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "punch_records_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "punch_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      report_executions: {
        Row: {
          created_at: string | null
          created_by: string | null
          error_message: string | null
          executed_by: string
          execution_duration: number | null
          execution_time: string | null
          file_url: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          parameters_used: Json | null
          record_count: number | null
          report_id: string
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          executed_by: string
          execution_duration?: number | null
          execution_time?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          parameters_used?: Json | null
          record_count?: number | null
          report_id: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          error_message?: string | null
          executed_by?: string
          execution_duration?: number | null
          execution_time?: string | null
          file_url?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          parameters_used?: Json | null
          record_count?: number | null
          report_id?: string
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "report_executions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          format: Database["public"]["Enums"]["report_format"] | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_scheduled: boolean | null
          module: string
          name: string
          parameters: Json | null
          query_template: string
          recipients: Json | null
          report_type: string
          schedule_cron: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          format?: Database["public"]["Enums"]["report_format"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_scheduled?: boolean | null
          module: string
          name: string
          parameters?: Json | null
          query_template: string
          recipients?: Json | null
          report_type: string
          schedule_cron?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          format?: Database["public"]["Enums"]["report_format"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_scheduled?: boolean | null
          module?: string
          name?: string
          parameters?: Json | null
          query_template?: string
          recipients?: Json | null
          report_type?: string
          schedule_cron?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          permission_id: string
          role_id: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          permission_id: string
          role_id: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          permission_id?: string
          role_id?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      salary_components: {
        Row: {
          calculation_type: Database["public"]["Enums"]["calculation_type"]
          code: string
          component_type: Database["public"]["Enums"]["salary_component_type"]
          created_at: string | null
          created_by: string | null
          default_value: number | null
          description: string | null
          display_order: number | null
          formula: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_esi_applicable: boolean | null
          is_mandatory: boolean | null
          is_provident_fund_applicable: boolean | null
          is_taxable: boolean | null
          name: string
          percentage_of: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          calculation_type: Database["public"]["Enums"]["calculation_type"]
          code: string
          component_type: Database["public"]["Enums"]["salary_component_type"]
          created_at?: string | null
          created_by?: string | null
          default_value?: number | null
          description?: string | null
          display_order?: number | null
          formula?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_esi_applicable?: boolean | null
          is_mandatory?: boolean | null
          is_provident_fund_applicable?: boolean | null
          is_taxable?: boolean | null
          name: string
          percentage_of?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          calculation_type?: Database["public"]["Enums"]["calculation_type"]
          code?: string
          component_type?: Database["public"]["Enums"]["salary_component_type"]
          created_at?: string | null
          created_by?: string | null
          default_value?: number | null
          description?: string | null
          display_order?: number | null
          formula?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_esi_applicable?: boolean | null
          is_mandatory?: boolean | null
          is_provident_fund_applicable?: boolean | null
          is_taxable?: boolean | null
          name?: string
          percentage_of?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      shifts: {
        Row: {
          break_duration: number | null
          created_at: string | null
          created_by: string | null
          end_time: string
          grace_period: number | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          name: string
          start_time: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          end_time: string
          grace_period?: number | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name: string
          start_time: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          break_duration?: number | null
          created_at?: string | null
          created_by?: string | null
          end_time?: string
          grace_period?: number | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          name?: string
          start_time?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      smtp_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          encryption: Database["public"]["Enums"]["encryption_type"] | null
          from_email: string
          from_name: string | null
          host: string
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          password: string
          port: number
          updated_at: string | null
          updated_by: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          encryption?: Database["public"]["Enums"]["encryption_type"] | null
          from_email: string
          from_name?: string | null
          host: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          password: string
          port: number
          updated_at?: string | null
          updated_by?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          encryption?: Database["public"]["Enums"]["encryption_type"] | null
          from_email?: string
          from_name?: string | null
          host?: string
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          password?: string
          port?: number
          updated_at?: string | null
          updated_by?: string | null
          username?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          data_type: Database["public"]["Enums"]["data_type"]
          description: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          is_encrypted: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          data_type: Database["public"]["Enums"]["data_type"]
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_encrypted?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          data_type?: Database["public"]["Enums"]["data_type"]
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          is_encrypted?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_contract_acceptance: {
        Row: {
          accepted_at: string | null
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          ip_address: unknown | null
          is_accepted: boolean | null
          is_active: boolean | null
          is_deleted: boolean | null
          updated_at: string | null
          updated_by: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_address?: unknown | null
          is_accepted?: boolean | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_address?: unknown | null
          is_accepted?: boolean | null
          is_active?: boolean | null
          is_deleted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_contract_acceptance_contract"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          can_add: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          permission_id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          can_add?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          permission_id: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          can_add?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          permission_id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          biometric_code: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          date_of_birth: string | null
          first_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          last_login_ip: unknown | null
          last_name: string
          middle_name: string | null
          personal_email: string | null
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          biometric_code?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          first_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          last_login_ip?: unknown | null
          last_name: string
          middle_name?: string | null
          personal_email?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          biometric_code?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          date_of_birth?: string | null
          first_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          last_login_ip?: unknown | null
          last_name?: string
          middle_name?: string | null
          personal_email?: string | null
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          role_id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          role_id: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          role_id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      work_weeks: {
        Row: {
          created_at: string | null
          created_by: string | null
          friday: boolean | null
          id: string
          is_active: boolean | null
          is_deleted: boolean | null
          monday: boolean | null
          name: string
          saturday: boolean | null
          sunday: boolean | null
          thursday: boolean | null
          tuesday: boolean | null
          updated_at: string | null
          updated_by: string | null
          wednesday: boolean | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          friday?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          monday?: boolean | null
          name: string
          saturday?: boolean | null
          sunday?: boolean | null
          thursday?: boolean | null
          tuesday?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          wednesday?: boolean | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          friday?: boolean | null
          id?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
          monday?: boolean | null
          name?: string
          saturday?: boolean | null
          sunday?: boolean | null
          thursday?: boolean | null
          tuesday?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          wednesday?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role_safe: {
        Args: { user_uuid: string }
        Returns: string
      }
      has_permission: {
        Args: { module_name: string; action: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_safe: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_hr_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_hr_manager_safe: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      approval_status: "pending" | "approved" | "rejected"
      attendance_status: "present" | "absent" | "half_day" | "holiday" | "leave"
      audit_action: "INSERT" | "UPDATE" | "DELETE"
      calculation_type: "fixed" | "percentage" | "formula"
      contract_status: "active" | "expired" | "terminated" | "draft"
      data_type: "string" | "number" | "boolean" | "json"
      employment_status: "active" | "inactive" | "terminated" | "on_leave"
      encryption_type: "tls" | "ssl"
      gender_type: "male" | "female" | "other"
      half_day_type: "first_half" | "second_half"
      holiday_type: "national" | "regional" | "company"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      onboarding_status:
        | "pending"
        | "contract_accepted"
        | "docs_uploaded"
        | "approved"
      payroll_status: "draft" | "processed" | "confirmed"
      punch_type: "in" | "out"
      report_format: "pdf" | "excel" | "csv"
      salary_component_type: "earning" | "deduction"
      template_type: "welcome" | "leave_approval" | "contract" | "payroll"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      approval_status: ["pending", "approved", "rejected"],
      attendance_status: ["present", "absent", "half_day", "holiday", "leave"],
      audit_action: ["INSERT", "UPDATE", "DELETE"],
      calculation_type: ["fixed", "percentage", "formula"],
      contract_status: ["active", "expired", "terminated", "draft"],
      data_type: ["string", "number", "boolean", "json"],
      employment_status: ["active", "inactive", "terminated", "on_leave"],
      encryption_type: ["tls", "ssl"],
      gender_type: ["male", "female", "other"],
      half_day_type: ["first_half", "second_half"],
      holiday_type: ["national", "regional", "company"],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      onboarding_status: [
        "pending",
        "contract_accepted",
        "docs_uploaded",
        "approved",
      ],
      payroll_status: ["draft", "processed", "confirmed"],
      punch_type: ["in", "out"],
      report_format: ["pdf", "excel", "csv"],
      salary_component_type: ["earning", "deduction"],
      template_type: ["welcome", "leave_approval", "contract", "payroll"],
    },
  },
} as const
