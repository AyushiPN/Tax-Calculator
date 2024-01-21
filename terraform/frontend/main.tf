provider "aws" {
    region = "eu-west-1"
}

resource "aws_ecr_repository" "tax_calc_proxy" {
  name = "tax-calc-proxy"
}

resource "aws_ecs_cluster" "frontend_cluster" {
  name = "frontend-cluster"
}

resource "aws_ecs_task_definition" "frontend_task" {
  family                   = "frontend-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]

  container_definitions = <<DEFINITION
[
  {
    "name": "frontend-container",
    "image": "${aws_ecr_repository.tax_calc_proxy.repository_url}:latest",  
    "cpu": 256,
    "memory": 512,
    "essential": true,
  }
]
DEFINITION
}

resource "aws_ecs_service" "frontend_service" {
  name            = "-service"
  cluster         = aws_ecs_cluster.frontend_cluster.id
  task_definition = aws_ecs_task_definition.frontend_task.arn
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = ["subnet-0003d5ada12f964ca"] 
    security_groups = ["sg-0737d50b02c59bbad"]      
  }
}
