<?php

class Book extends CI_Controller {

	public function __construct()
    {
        parent::__construct();
        $this->load->helper('url');
        $this->load->model('Book_model');
    }

    public function index(){
		$this->load->view('bookref');
    }

	public function get()
	{
		echo json_encode($this->Book_model->get_books());
	}

	public function create(){
		$this->Book_model->add_book();
	}

	public function edit(){
		$this->Book_model->edit_book();
	}

	public function remove(){
		$this->Book_model->remove_book();
		
	}
}