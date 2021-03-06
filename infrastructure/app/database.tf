resource "mongodbatlas_project" "atlas_project" {
  org_id = var.atlas_org_id
  name   = "holdem"
}

# IP Whitelist
resource "mongodbatlas_project_ip_whitelist" "bastion_ip" {
  project_id = mongodbatlas_project.atlas_project.id
  ip_address = aws_instance.bastion_host.public_ip
  comment    = "IP address for holdem bastion host"
}

# Cluster
resource "mongodbatlas_cluster" "db_cluster" {
  project_id = mongodbatlas_project.atlas_project.id
  name       = "holdem-cluster"

  num_shards                   = 1
  replication_factor           = 3
  provider_backup_enabled      = false
  auto_scaling_disk_gb_enabled = false
  mongo_db_major_version       = "4.2"

  # This keeps it free tier
  provider_name               = "TENANT"
  backing_provider_name       = "AWS"
  disk_size_gb                = "2"
  provider_instance_size_name = "M2"
  provider_region_name        = "US_EAST_1"
}

# Users
resource "mongodbatlas_database_user" "admin_db_user" {
  username           = var.db_admin_username
  password           = var.db_admin_password
  project_id         = mongodbatlas_project.atlas_project.id
  auth_database_name = "admin"

  roles {
    role_name     = "atlasAdmin"
    database_name = "admin"
  }

  scopes {
    name = mongodbatlas_cluster.db_cluster.name
    type = "CLUSTER"
  }
}

resource "mongodbatlas_database_user" "app_db_user" {
  username           = var.db_app_username
  password           = var.db_app_password
  project_id         = mongodbatlas_project.atlas_project.id
  auth_database_name = "admin"

  roles {
    role_name     = "readWrite"
    database_name = "holdem"
  }

  roles {
    role_name     = "readAnyDatabase"
    database_name = "admin"
  }

  scopes {
    name = mongodbatlas_cluster.db_cluster.name
    type = "CLUSTER"
  }
}

# IP Whitelist
resource "mongodbatlas_project_ip_whitelist" "full_internet" {
  project_id = mongodbatlas_project.atlas_project.id
  cidr_block = local.cidr_blocks.internet
  comment    = "Whitelist whole internet to avoid paying for a NAT gateway"
}
